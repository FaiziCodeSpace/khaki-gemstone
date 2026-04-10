// services/bargainerServices/api.bargainerService.js
// Attaches window.bargainerAccessToken as Bearer token.
// Mirrors the agent API service pattern.

import axios from "axios";

const bargainerApi = axios.create({
  baseURL:         import.meta.env.VITE_API_URL,
  withCredentials: true,
});

bargainerApi.interceptors.request.use((config) => {
  const token = window.bargainerAccessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default bargainerApi;