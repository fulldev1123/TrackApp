import { ref } from "vue";
import axios from "axios";
import { useConfig } from "./useConfig";

export function useTrackApi() {
  const { apiBaseUrl } = useConfig();

  const tracks = ref([]);
  const loading = ref(false);
  const error = ref("");

  const api = axios.create({
    baseURL: apiBaseUrl,
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
      return response.data;
    } catch (err) {
      const errorMessage =
        "Failed to fetch tracks: " + (err.response?.data?.error || err.message);
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const createTrack = async (trackData) => {
    try {
      loading.value = true;
      error.value = "";
      const response = await api.post("/tracks", trackData);

      tracks.value.push(response.data);

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const updateTrack = async (id, trackData) => {
    try {
      loading.value = true;
      error.value = "";
      const response = await api.put(`/tracks/${id}`, trackData);

      const index = tracks.value.findIndex((track) => track.id === id);
      if (index !== -1) {
        tracks.value[index] = response.data;
      }

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete a track (if needed in the future)
   * @param {number} id - Track ID to delete
   */
  const deleteTrack = async (id) => {
    try {
      loading.value = true;
      error.value = "";
      await api.delete(`/tracks/${id}`);

      // Remove the track from local state
      tracks.value = tracks.value.filter((track) => track.id !== id);

      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get a single track by ID
   * @param {number} id - Track ID
   */
  const getTrack = (id) => {
    return tracks.value.find((track) => track.id === id) || null;
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = "";
  };

  /**
   * Refresh tracks (alias for fetchTracks)
   */
  const refreshTracks = fetchTracks;

  // Return the composable API
  return {
    // State
    tracks,
    loading,
    error,

    // Methods
    fetchTracks,
    createTrack,
    updateTrack,
    deleteTrack,
    getTrack,
    clearError,
    refreshTracks,
  };
}
