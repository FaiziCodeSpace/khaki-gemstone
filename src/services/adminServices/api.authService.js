import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:8080/api", 
  withCredentials: true, 
});

// Attach token to every request
adminApi.interceptors.request.use((config) => {
  const token = window.adminAccessToken; 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token if 401 occurs
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes('/refresh-token')
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          "http://localhost:8080/api/admin/refresh-token",
          {},
          { withCredentials: true }
        );
        const { accessToken } = res.data;
        window.adminAccessToken = accessToken;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return adminApi(originalRequest);
      } catch (err) {
        window.adminAccessToken = null;
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;