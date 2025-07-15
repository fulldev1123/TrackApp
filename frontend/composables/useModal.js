import { ref, computed } from "vue";

export function useModal() {
  const showModal = ref(false);
  const editingTrack = ref(null);
  const formLoading = ref(false);
  const formError = ref("");

  const isEditing = computed(() => !!editingTrack.value);
  const modalTitle = computed(() =>
    isEditing.value ? "Edit Track" : "Add New Track"
  );

  /**
   * Open modal for creating a new track
   */
  const openCreateModal = () => {
    editingTrack.value = null;
    formError.value = "";
    formLoading.value = false;
    showModal.value = true;
  };

  /**
   * Open modal for editing an existing track
   * @param {Object} track - Track to edit
   */
  const openEditModal = (track) => {
    if (!track) {
      console.warn("openEditModal called without track data");
      return;
    }

    editingTrack.value = { ...track }; // Create a copy to avoid mutations
    formError.value = "";
    formLoading.value = false;
    showModal.value = true;
  };

  /**
   * Close the modal and reset state
   */
  const closeModal = () => {
    showModal.value = false;
    editingTrack.value = null;
    formError.value = "";
    formLoading.value = false;
  };

  /**
   * Set form loading state
   * @param {boolean} loading - Loading state
   */
  const setFormLoading = (loading) => {
    formLoading.value = loading;
  };

  /**
   * Set form error
   * @param {string} error - Error message
   */
  const setFormError = (error) => {
    formError.value = error;
  };

  /**
   * Clear form error
   */
  const clearFormError = () => {
    formError.value = "";
  };

  /**
   * Reset all modal state
   */
  const resetModal = () => {
    showModal.value = false;
    editingTrack.value = null;
    formError.value = "";
    formLoading.value = false;
  };

  /**
   * Handle modal form submission
   * @param {Function} submitHandler - Function to handle the actual submission
   * @param {Object} formData - Form data to submit
   */
  const handleFormSubmit = async (submitHandler, formData) => {
    try {
      setFormLoading(true);
      clearFormError();

      await submitHandler(formData);

      // Close modal on successful submission
      closeModal();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Check if modal can be closed (no pending operations)
   */
  const canCloseModal = computed(() => !formLoading.value);

  // Return the composable API
  return {
    // State
    showModal,
    editingTrack,
    formLoading,
    formError,

    // Computed
    isEditing,
    modalTitle,
    canCloseModal,

    // Methods
    openCreateModal,
    openEditModal,
    closeModal,
    setFormLoading,
    setFormError,
    clearFormError,
    resetModal,
    handleFormSubmit,
  };
}
