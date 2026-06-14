import axios from "axios";

// ===========================
// BASE API
// ===========================
const api = axios.create({
  baseURL:  "https://api-rccgyouthgloryofgod.onrender.com/api",
  withCredentials: true,
});

// ===========================
// REFRESH API
// ===========================
const refreshApi = axios.create({
  baseURL:  "https://api-rccgyouthgloryofgod.onrender.com/api",
  withCredentials: true,
});

// ===========================
// MEMORY TOKEN
// ===========================
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

// attach token
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ===========================
// REFRESH STATE
// ===========================
let isRefreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
  queue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });

  queue = [];
};

// ===========================
// RESPONSE INTERCEPTOR
// ===========================
api.interceptors.response.use(
  (res) => res,

  async (error) => {
    const original = error.config;

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    isRefreshing = true;

    try {
      const res = await refreshApi.post("/admin/refresh-token");

      const newToken = res.data?.newAccessToken;

      if (!newToken) {
        throw new Error("No access token returned");
      }

      setAccessToken(newToken);

      isRefreshing = false;
      processQueue(null, newToken);

      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);

    } catch (err) {
      isRefreshing = false;
      processQueue(err, null);

      setAccessToken(null);
      localStorage.removeItem("isLoggedIn");

      return Promise.reject(err);
    }
  }
);

export default api;