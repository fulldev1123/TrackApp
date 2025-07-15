export function useConfig() {
  const config = {
    apiBaseUrl: import.meta.env.API_BASE_URL || "http://127.0.0.1:8000/api",
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  };

  return config;
}
