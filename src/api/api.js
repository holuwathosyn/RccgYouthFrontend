import axios from "axios";

// ===========================
// MAIN API INSTANCE
// ===========================
const api = axios.create({
  baseURL: "https://api-rccgyouthgloryofgod.onrender.com/api",
  withCredentials: true,
});

// ===========================
// REFRESH INSTANCE (NO INTERCEPTOR)
// ===========================
const refreshApi = axios.create({
  baseURL: "https://api-rccgyouthgloryofgod.onrender.com/api",
  withCredentials: true,
});

// ===========================
// FLAG (PREVENT MULTIPLE REFRESH CALLS)
// ===========================
let isRefreshing = false;
let failedQueue = [];

// process queue after refresh
const processQueue = (error = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });

  failedQueue = [];
};

// ===========================
// INTERCEPTOR
// ===========================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // prevent infinite retry
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      // refresh token
      await refreshApi.post("/admin/refresh-token");

      processQueue();

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      // force logout behavior
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;