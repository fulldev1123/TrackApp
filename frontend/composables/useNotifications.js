import { ref, computed } from "vue";

export function useNotifications() {
  const error = ref("");
  const success = ref("");
  const autoHideTimeout = ref(null);

  const DEFAULT_HIDE_DURATION = 3000;

  const hasError = computed(() => !!error.value);
  const hasSuccess = computed(() => !!success.value);
  const hasNotifications = computed(() => hasError.value || hasSuccess.value);

  /**
   * Clear all notifications
   */
  const clearAll = () => {
    error.value = "";
    success.value = "";
    clearAutoHideTimeout();
  };

  /**
   * Clear error notification
   */
  const clearError = () => {
    error.value = "";
  };

  /**
   * Clear success notification
   */
  const clearSuccess = () => {
    success.value = "";
  };

  /**
   * Clear auto-hide timeout
   */
  const clearAutoHideTimeout = () => {
    if (autoHideTimeout.value) {
      clearTimeout(autoHideTimeout.value);
      autoHideTimeout.value = null;
    }
  };

  /**
   * Set up auto-hide for success messages
   * @param {number} duration - Duration in milliseconds
   */
  const setupAutoHide = (duration = DEFAULT_HIDE_DURATION) => {
    clearAutoHideTimeout();

    if (success.value) {
      autoHideTimeout.value = setTimeout(() => {
        clearSuccess();
      }, duration);
    }
  };

  /**
   * Show error message
   * @param {string} message - Error message to display
   * @param {boolean} clearOthers - Whether to clear other notifications
   */
  const showError = (message, clearOthers = true) => {
    if (clearOthers) {
      clearSuccess();
    }

    error.value = message;
    clearAutoHideTimeout();
  };

  /**
   * Show success message
   * @param {string} message - Success message to display
   * @param {boolean} clearOthers - Whether to clear other notifications
   * @param {number} autoHideDuration - Auto-hide duration (0 to disable)
   */
  const showSuccess = (
    message,
    clearOthers = true,
    autoHideDuration = DEFAULT_HIDE_DURATION
  ) => {
    if (clearOthers) {
      clearError();
    }

    success.value = message;

    if (autoHideDuration > 0) {
      setupAutoHide(autoHideDuration);
    }
  };

  /**
   * Show notification based on type
   * @param {string} type - 'success' or 'error'
   * @param {string} message - Message to display
   * @param {Object} options - Additional options
   */
  const showNotification = (type, message, options = {}) => {
    const { clearOthers = true, autoHide = DEFAULT_HIDE_DURATION } = options;

    if (type === "success") {
      showSuccess(message, clearOthers, autoHide);
    } else if (type === "error") {
      showError(message, clearOthers);
    } else {
      console.warn(`Unknown notification type: ${type}`);
    }
  };

  /**
   * Handle API response and show appropriate notification
   * @param {Promise} apiCall - API call promise
   * @param {Object} messages - Success and error messages
   */
  const handleApiResponse = async (apiCall, messages = {}) => {
    const {
      successMessage = "Operation completed successfully",
      errorPrefix = "Operation failed: ",
    } = messages;

    try {
      clearAll();
      const result = await apiCall;
      showSuccess(successMessage);
      return result;
    } catch (err) {
      const errorMessage = errorPrefix + (err.message || "Unknown error");
      showError(errorMessage);
      throw err;
    }
  };

  /**
   * Create a notification handler for specific operations
   * @param {string} operation - Operation name (e.g., 'create', 'update', 'delete')
   */
  const createOperationHandler = (operation) => {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return {
      success: (itemName = "item") =>
        showSuccess(`${capitalize(itemName)} ${operation}d successfully!`),
      error: (error, itemName = "item") =>
        showError(
          `Failed to ${operation} ${itemName}: ${error.message || error}`
        ),
    };
  };

  // Pre-configured handlers for common operations
  const trackHandlers = {
    create: createOperationHandler("create"),
    update: createOperationHandler("update"),
    delete: createOperationHandler("delete"),
    fetch: {
      success: () => showSuccess("Tracks loaded successfully!"),
      error: (error) =>
        showError(`Failed to load tracks: ${error.message || error}`),
    },
  };

  // Return the composable API
  return {
    // State
    error,
    success,

    // Computed
    hasError,
    hasSuccess,
    hasNotifications,

    // Methods
    clearAll,
    clearError,
    clearSuccess,
    showError,
    showSuccess,
    showNotification,
    handleApiResponse,
    createOperationHandler,

    // Pre-configured handlers
    trackHandlers,
  };
}
