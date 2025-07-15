<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <h1 class="title">🎵 Track Manager</h1>
        <p class="subtitle">Manage your music tracks with Symfony + Vue.js</p>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <!-- Success/Error Messages -->
        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <div v-if="success" class="alert alert-success">
          {{ success }}
        </div>

        <!-- Table Header -->
        <TableHeader
          title="Track List"
          :subtitle="`${tracks.length} track${
            tracks.length !== 1 ? 's' : ''
          } total`"
          :loading="loading"
          @refresh="fetchTracks"
          @add="openCreateModal"
        />

        <!-- Track Table -->
        <TrackTable :tracks="tracks" :loading="loading" @edit="openEditModal" />

        <!-- Track Form Modal -->
        <BaseModal
          :show="showModal"
          :title="editingTrack ? 'Edit Track' : 'Add New Track'"
          @close="closeModal"
        >
          <TrackForm
            :track="editingTrack"
            :loading="formLoading"
            :error="formError"
            @submit="submitTrack"
            @cancel="closeModal"
          />
        </BaseModal>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import BaseModal from "./components/BaseModal.vue";
import TableHeader from "./components/TableHeader.vue";
import TrackTable from "./components/TrackTable.vue";
import TrackForm from "./components/TrackForm.vue";

// Composables
import { useTrackApi } from "./composables/useTrackApi";
import { useModal } from "./composables/useModal";
import { useNotifications } from "./composables/useNotifications";

// Use composables
const { tracks, loading, fetchTracks, createTrack, updateTrack } =
  useTrackApi();

const {
  showModal,
  editingTrack,
  formLoading,
  formError,
  modalTitle,
  openCreateModal,
  openEditModal,
  closeModal,
  setFormLoading,
  setFormError,
  clearFormError,
} = useModal();

const {
  error,
  success,
  showError,
  showSuccess,
  clearAll: clearNotifications,
  trackHandlers,
} = useNotifications();

// Form submission handler
const submitTrack = async (trackData) => {
  try {
    setFormLoading(true);
    clearFormError();
    clearNotifications();

    if (editingTrack.value) {
      await updateTrack(editingTrack.value.id, trackData);
      trackHandlers.update.success("track");
    } else {
      await createTrack(trackData);
      trackHandlers.create.success("track");
    }

    closeModal();
    await fetchTracks();
  } catch (err) {
    const errorMessage = err.response?.data?.error || err.message;
    setFormError(errorMessage);
  } finally {
    setFormLoading(false);
  }
};

// Enhanced fetch with error handling
const handleFetchTracks = async () => {
  try {
    await fetchTracks();
  } catch (err) {
    trackHandlers.fetch.error(err);
  }
};

// Lifecycle
onMounted(() => {
  handleFetchTracks();
});
</script>

<style>
/* Import global styles */
@import "./styles/global.css";
</style>

<style scoped>
/* Component-specific styles for App.vue */

#app {
  min-height: 100vh;
}

/* Header Styles */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Main Content */
.main {
  padding: 2rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 1.5rem 0;
  }

  .title {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>
