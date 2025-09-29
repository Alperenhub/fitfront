import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5153/api",
});

// Request interceptor → her request'e token ekler
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor → hata yakalama
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // örn: token expired → logout yapabilirsin
      localStorage.clear();
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
