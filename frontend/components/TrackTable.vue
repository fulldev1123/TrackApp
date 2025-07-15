<template>
  <div class="table-container">
    <!-- Loading State -->
    <div v-if="loading && tracks.length === 0" class="table-loading">
      <div class="loading-spinner"></div>
      <p>Loading tracks...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="tracks.length === 0" class="table-empty">
      <div class="empty-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      </div>
      <h3>No tracks found</h3>
      <p>Get started by adding your first track!</p>
    </div>

    <!-- Table -->
    <div v-else class="table-wrapper">
      <table class="tracks-table">
        <thead>
          <tr>
            <th class="th-id">#</th>
            <th class="th-title">Title</th>
            <th class="th-artist">Artist</th>
            <th class="th-duration">Duration</th>
            <th class="th-isrc">ISRC</th>
            <th class="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="track in tracks"
            :key="track.id"
            class="table-row"
            :class="{ 'row-loading': loading }"
          >
            <td class="td-id">{{ track.id }}</td>
            <td class="td-title">
              <div class="title-cell">
                <span class="track-title">{{ track.title }}</span>
              </div>
            </td>
            <td class="td-artist">
              <span class="track-artist">{{ track.artist }}</span>
            </td>
            <td class="td-duration">
              <span class="badge badge-primary">{{
                formatDuration(track.duration)
              }}</span>
            </td>
            <td class="td-isrc">
              <span v-if="track.isrc" class="badge badge-success">{{
                track.isrc
              }}</span>
              <span v-else class="no-isrc">—</span>
            </td>
            <td class="td-actions">
              <button
                class="btn-edit"
                @click="$emit('edit', track)"
                :disabled="loading"
                title="Edit track"
              >
                <svg
                  class="icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span class="btn-text">Edit</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tracks: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["edit"]);

// Utility function
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
</script>

<style scoped>
/* Component-specific styles for TrackTable */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.table-loading,
.table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #6b7280;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.table-empty h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.table-empty p {
  margin: 0;
  font-size: 0.875rem;
}

.table-wrapper {
  overflow-x: auto;
}

.tracks-table {
  width: 100%;
  border-collapse: collapse;
}

.tracks-table th {
  background: #f9fafb;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.tracks-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.table-row:hover {
  background: #f9fafb;
}

.row-loading {
  opacity: 0.6;
}

.th-id {
  width: 60px;
}

.th-actions {
  width: 100px;
  text-align: center;
}

.td-id {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
}

.title-cell {
  display: flex;
  align-items: center;
}

.track-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.track-artist {
  color: #6b7280;
  font-size: 0.875rem;
}

.no-isrc {
  color: #d1d5db;
  font-size: 0.875rem;
}

.td-actions {
  text-align: center;
}

.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.btn-edit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-edit .icon {
  width: 14px;
  height: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .tracks-table th,
  .tracks-table td {
    padding: 0.75rem 0.5rem;
  }

  .th-id,
  .td-id {
    display: none;
  }

  .btn-text {
    display: none;
  }

  .btn-edit {
    padding: 0.5rem;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .th-isrc,
  .td-isrc {
    display: none;
  }
}
</style>
