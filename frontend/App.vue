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
        <!-- Add Track Form -->
        <div class="card">
          <h2>{{ editingTrack ? "Edit Track" : "Add New Track" }}</h2>
          <form @submit.prevent="submitTrack" class="track-form">
            <div class="form-group">
              <label for="title">Title *</label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                placeholder="Enter track title"
                required
              />
            </div>

            <div class="form-group">
              <label for="artist">Artist *</label>
              <input
                id="artist"
                v-model="form.artist"
                type="text"
                placeholder="Enter artist name"
                required
              />
            </div>

            <div class="form-group">
              <label for="duration">Duration (seconds) *</label>
              <input
                id="duration"
                v-model.number="form.duration"
                type="number"
                placeholder="Enter duration in seconds"
                min="1"
                required
              />
            </div>

            <div class="form-group">
              <label for="isrc">ISRC Code</label>
              <input
                id="isrc"
                v-model="form.isrc"
                type="text"
                placeholder="e.g., US-ABC-12-34567"
                pattern="[A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5}"
                title="Format: XX-XXX-XX-XXXXX"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{
                  loading
                    ? "Saving..."
                    : editingTrack
                    ? "Update Track"
                    : "Add Track"
                }}
              </button>
              <button
                v-if="editingTrack"
                type="button"
                class="btn btn-secondary"
                @click="cancelEdit"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="success" class="alert alert-success">
          {{ success }}
        </div>

        <!-- Tracks List -->
        <div class="card">
          <div class="card-header">
            <h2>Track List</h2>
            <button
              @click="fetchTracks"
              class="btn btn-secondary"
              :disabled="loading"
            >
              {{ loading ? "Loading..." : "Refresh" }}
            </button>
          </div>

          <div v-if="loading && tracks.length === 0" class="loading">
            Loading tracks...
          </div>

          <div v-else-if="tracks.length === 0" class="empty-state">
            <p>No tracks found. Add your first track above!</p>
          </div>

          <div v-else class="tracks-grid">
            <div v-for="track in tracks" :key="track.id" class="track-card">
              <div class="track-info">
                <h3 class="track-title">{{ track.title }}</h3>
                <p class="track-artist">by {{ track.artist }}</p>
                <div class="track-details">
                  <span class="duration">{{
                    formatDuration(track.duration)
                  }}</span>
                  <span v-if="track.isrc" class="isrc">{{ track.isrc }}</span>
                </div>
              </div>
              <div class="track-actions">
                <button
                  @click="editTrack(track)"
                  class="btn btn-small btn-primary"
                  :disabled="loading"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api";

// Reactive state
const tracks = ref([]);
const loading = ref(false);
const error = ref("");
const success = ref("");
const editingTrack = ref(null);

// Form data
const form = ref({
  title: "",
  artist: "",
  duration: "",
  isrc: "",
});

// API Functions
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const fetchTracks = async () => {
  try {
    loading.value = true;
    error.value = "";
    const response = await api.get("/tracks");
    tracks.value = response.data;
  } catch (err) {
    error.value =
      "Failed to fetch tracks: " + (err.response?.data?.error || err.message);
  } finally {
    loading.value = false;
  }
};

const createTrack = async (trackData) => {
  const response = await api.post("/tracks", trackData);
  return response.data;
};

const updateTrack = async (id, trackData) => {
  const response = await api.put(`/tracks/${id}`, trackData);
  return response.data;
};

// Form Functions
const resetForm = () => {
  form.value = {
    title: "",
    artist: "",
    duration: "",
    isrc: "",
  };
  editingTrack.value = null;
};

const submitTrack = async () => {
  try {
    loading.value = true;
    error.value = "";
    success.value = "";

    const trackData = {
      title: form.value.title,
      artist: form.value.artist,
      duration: parseInt(form.value.duration),
      isrc: form.value.isrc || null,
    };

    if (editingTrack.value) {
      await updateTrack(editingTrack.value.id, trackData);
      success.value = "Track updated successfully!";
    } else {
      await createTrack(trackData);
      success.value = "Track created successfully!";
    }

    resetForm();
    await fetchTracks();

    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = "";
    }, 3000);
  } catch (err) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    loading.value = false;
  }
};

const editTrack = (track) => {
  editingTrack.value = track;
  form.value = {
    title: track.title,
    artist: track.artist,
    duration: track.duration,
    isrc: track.isrc || "",
  };

  // Scroll to form
  document.querySelector(".track-form").scrollIntoView({ behavior: "smooth" });
};

const cancelEdit = () => {
  resetForm();
  success.value = "";
  error.value = "";
};

// Utility Functions
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Lifecycle
onMounted(() => {
  fetchTracks();
});
</script>

<style scoped>
/* Global Styles */
* {
  box-sizing: border-box;
}

#app {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
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

/* Cards */
.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e1e8ed;
}

.card h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  margin: 0;
}

/* Forms */
.track-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
  transform: translateY(-1px);
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Alerts */
.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 500;
}

.alert-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

/* Loading and Empty States */
.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1.1rem;
}

.empty-state p {
  margin: 0;
}

/* Tracks Grid */
.tracks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.track-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.track-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.track-info {
  margin-bottom: 1rem;
}

.track-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.track-artist {
  margin: 0 0 1rem 0;
  color: #64748b;
  font-style: italic;
}

.track-details {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.duration {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.isrc {
  background: #ecfdf5;
  color: #166534;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: monospace;
}

.track-actions {
  display: flex;
  justify-content: flex-end;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }

  .title {
    font-size: 2rem;
  }

  .card {
    padding: 1.5rem;
  }

  .tracks-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
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

  .card {
    padding: 1rem;
  }
}
</style>
