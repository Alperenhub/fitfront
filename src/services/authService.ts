// services/authService.ts
import axios from "axios";

const API_URL = "http://localhost:5153/api";

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // refresh token cookie’den gelecek
});

// Login
export const login = async (role: "Trainer" | "Student", username: string, password: string) => {
  const response = await api.post(`/${role}/login`, { username, password });

  const token = response.data.accessToken;
  localStorage.setItem(role.toLowerCase() + "Token", token);
  localStorage.setItem("role", response.data.role);
  localStorage.setItem("username", response.data.username);

  return response.data;
};

// Register
export const register = async (role: "Trainer" | "Student", formData: FormData) => {
  const response = await api.post(`/${role}/register`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Refresh token
export const refreshToken = async (role: "Trainer" | "Student") => {
  const endpoint = role === "Student" ? "/Student/refresh" : "/Trainer/refresh";
  const response = await api.post(endpoint);
  const token = response.data.accessToken;
  localStorage.setItem(role.toLowerCase() + "Token", token);
  return token;
};

// Axios interceptors
api.interceptors.request.use((config) => {
  const role = localStorage.getItem("role")?.toLowerCase();
  if (role) {
    const tokenKey = role === "student" ? "studentToken" : "trainerToken";
    const token = localStorage.getItem(tokenKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const role = (localStorage.getItem("role") as "student" | "trainer") || "student";
        const newToken = await refreshToken(role === "student" ? "Student" : "Trainer");
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token expired veya geçersiz.");
        // logout işlemi burada tetiklenebilir
      }
    }
    return Promise.reject(error);
  }
);

export default api;
