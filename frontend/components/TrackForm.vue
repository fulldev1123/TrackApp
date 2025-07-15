<template>
  <form @submit.prevent="handleSubmit" class="track-form">
    <div class="form-group">
      <label for="title" class="form-label">Title *</label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        class="form-input"
        placeholder="Enter track title"
        required
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <label for="artist" class="form-label">Artist *</label>
      <input
        id="artist"
        v-model="formData.artist"
        type="text"
        class="form-input"
        placeholder="Enter artist name"
        required
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <label for="duration" class="form-label">Duration *</label>
      <input
        id="duration"
        v-model="durationInput"
        type="text"
        class="form-input"
        placeholder="mm:ss (e.g., 3:45)"
        pattern="^[0-9]+:[0-5][0-9]$"
        required
        :disabled="loading"
        @blur="validateDurationFormat"
      />
      <div class="form-hint">
        Enter duration in mm:ss format (e.g., 3:45 for 3 minutes 45 seconds)
      </div>
      <div v-if="durationError" class="duration-error">
        {{ durationError }}
      </div>
    </div>

    <div class="form-group">
      <label for="isrc" class="form-label">ISRC Code</label>
      <input
        id="isrc"
        v-model="formData.isrc"
        type="text"
        class="form-input"
        placeholder="e.g., US-ABC-12-34567"
        pattern="[A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5}"
        title="Format: XX-XXX-XX-XXXXX"
        :disabled="loading"
      />
      <div class="form-hint">
        Optional. Format: XX-XXX-XX-XXXXX (e.g., US-ABC-12-34567)
      </div>
    </div>

    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <div class="form-actions">
      <button
        type="button"
        class="btn btn-secondary"
        @click="$emit('cancel')"
        :disabled="loading"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="loading || !isFormValid"
      >
        <span v-if="loading" class="loading-spinner"></span>
        {{
          loading ? "Saving..." : isEditing ? "Update Track" : "Create Track"
        }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  track: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["submit", "cancel"]);

const formData = ref({
  title: "",
  artist: "",
  duration: 0,
  isrc: "",
});

const durationInput = ref("");
const durationError = ref("");

const isEditing = computed(() => !!props.track);

const isFormValid = computed(() => {
  return (
    formData.value.title.trim() &&
    formData.value.artist.trim() &&
    formData.value.duration > 0 &&
    !durationError.value
  );
});

const convertMmSsToSeconds = (mmss) => {
  if (!mmss || !mmss.includes(":")) return 0;

  const [minutes, seconds] = mmss.split(":").map((num) => parseInt(num) || 0);
  return minutes * 60 + seconds;
};

const convertSecondsToMmSs = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const validateDurationFormat = () => {
  durationError.value = "";

  if (!durationInput.value) {
    durationError.value = "Duration is required";
    formData.value.duration = 0;
    return;
  }

  const mmssPattern = /^[0-9]+:[0-5][0-9]$/;
  if (!mmssPattern.test(durationInput.value)) {
    durationError.value = "Please enter duration in mm:ss format (e.g., 7:30)";
    formData.value.duration = 0;
    return;
  }

  const seconds = convertMmSsToSeconds(durationInput.value);
  if (seconds <= 0) {
    durationError.value = "Duration must be greater than 0";
    formData.value.duration = 0;
    return;
  }

  formData.value.duration = seconds;
};

const handleSubmit = () => {
  validateDurationFormat();

  if (!isFormValid.value) return;

  const trackData = {
    title: formData.value.title.trim(),
    artist: formData.value.artist.trim(),
    duration: formData.value.duration,
    isrc: formData.value.isrc.trim() || null,
  };

  emit("submit", trackData);
};

const resetForm = () => {
  formData.value = {
    title: "",
    artist: "",
    duration: 0,
    isrc: "",
  };
  durationInput.value = "";
  durationError.value = "";
};

watch(
  () => props.track,
  (newTrack) => {
    if (newTrack) {
      formData.value = {
        title: newTrack.title || "",
        artist: newTrack.artist || "",
        duration: newTrack.duration || 0,
        isrc: newTrack.isrc || "",
      };
      durationInput.value = newTrack.duration
        ? convertSecondsToMmSs(newTrack.duration)
        : "";
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

watch(durationInput, () => {
  if (durationInput.value) {
    validateDurationFormat();
  }
});

// Expose methods for parent component
defineExpose({
  resetForm,
});
</script>

<style scoped>
.track-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.duration-error {
  font-size: 0.75rem;
  color: #dc2626;
  font-weight: 500;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  min-width: 120px;
}

@media (max-height: 768px) {
  .track-form {
    gap: 0.75rem;
  }

  .form-actions {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
  }
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
