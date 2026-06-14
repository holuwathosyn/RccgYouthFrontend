import axios from "axios";

// ===========================
// MAIN API INSTANCE
// ===========================
const api = axios.create({
  baseURL: "https://api-rccgyouthgloryofgod.onrender.com/api",
  withCredentials: true,
});

// ===========================
// SEPARATE REFRESH INSTANCE (IMPORTANT)
// ===========================
const refreshApi = axios.create({
  baseURL: "https://api-rccgyouthgloryofgod.onrender.com/api",
  withCredentials: true,
});

// ===========================
// AUTO REFRESH TOKEN INTERCEPTOR
// ===========================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // 🔥 use SAFE instance (NO interceptor)
        await refreshApi.post("/admin/refresh-token");

        // retry original request
        return api(originalRequest);

      } catch (refreshError) {
        // if refresh fails → force logout
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;