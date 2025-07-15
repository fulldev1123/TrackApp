<template>
  <div class="table-header">
    <div class="header-left">
      <h2 class="table-title">{{ title }}</h2>
      <div v-if="subtitle" class="table-subtitle">{{ subtitle }}</div>
    </div>

    <div class="header-actions">
      <button
        class="btn btn-secondary btn-icon"
        @click="$emit('refresh')"
        :disabled="loading"
        title="Refresh data"
      >
        <svg
          class="icon"
          :class="{ spinning: loading }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span class="btn-text">Refresh</span>
      </button>

      <button
        class="btn btn-primary btn-icon"
        @click="$emit('add')"
        :disabled="loading"
      >
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span class="btn-text">Add Track</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "Track List",
  },
  subtitle: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["refresh", "add"]);
</script>

<style scoped>
/* Component-specific styles for TableHeader */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.header-left {
  flex: 1;
}

.table-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.table-subtitle {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.btn-icon {
  padding: 0.75rem 1rem;
}

.icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-text {
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-actions {
    justify-content: flex-end;
  }

  .btn-text {
    display: none;
  }

  .btn-icon {
    padding: 0.75rem;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .header-actions {
    justify-content: stretch;
  }

  .btn {
    flex: 1;
    justify-content: center;
  }

  .btn-text {
    display: inline;
  }
}
</style>
