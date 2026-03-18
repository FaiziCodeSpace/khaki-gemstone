// services/agentServices/api.agentService.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const agentApi = axios.create({
  baseURL:         BASE,
  withCredentials: true,
});

// ── Attach access token to every request ──
agentApi.interceptors.request.use((config) => {
  if (window.agentAccessToken) {
    config.headers.Authorization = `Bearer ${window.agentAccessToken}`;
  }
  return config;
});

// ── Auto-refresh on 401 — but NEVER for the refresh-token endpoint itself ──
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => error ? reject(error) : resolve());
  failedQueue = [];
};

agentApi.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // Skip retry for the refresh-token call itself — prevents infinite loop
    if (original.url?.includes("/agents/refresh-token")) {
      return Promise.reject(err);
    }

    if (err.response?.status !== 401 || original._retry) {
      return Promise.reject(err);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => agentApi(original)).catch((e) => Promise.reject(e));
    }

    original._retry  = true;
    isRefreshing     = true;

    try {
      // Use a plain fetch to avoid going through this same interceptor
      const res = await axios.post(
        `${BASE}/agents/refresh-token`,
        {},
        { withCredentials: true }
      );
      window.agentAccessToken = res.data.accessToken;
      processQueue(null);
      return agentApi(original);
    } catch (refreshErr) {
      window.agentAccessToken = null;
      processQueue(refreshErr);
      // Redirect to login if refresh fails mid-session
      window.location.href = "/agent/login";
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default agentApi;