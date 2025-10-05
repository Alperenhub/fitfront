import axios from "axios";

const API_URL = "http://localhost:5153/api";

// axios instance (cookie gönderilmesi için withCredentials şart)
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // refreshToken cookie gönderilecek
});

// AccessToken memory’de dursun
let accessToken: string = localStorage.getItem("accessToken") || "";

export const login = async (role: "Trainer" | "Student", username: string, password: string) => {
  const response = await api.post(`/${role}/login`, { username, password });

  // backend'den sadece accessToken gelecek (refresh cookie’de zaten var)
  accessToken = response.data.accessToken;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("role", response.data.role);
  localStorage.setItem("username", response.data.username);

  return response.data;
};

export const register = async (role: "Trainer" | "Student", formData: FormData) => {
  const response = await api.post(`/${role}/register`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Yeni access token al
export const refreshToken = async () => {
  const response = await api.post("/Student/refresh"); // Trainer için ayrı endpoint olacak
  accessToken = response.data.accessToken;
  localStorage.setItem("accessToken", accessToken);
  return accessToken;
};

// Axios interceptor
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
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
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token expired veya geçersiz.");
        // logout işlemi yapılabilir
      }
    }
    return Promise.reject(error);
  }
);
