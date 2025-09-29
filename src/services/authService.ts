import axios from "axios";

const API_URL = "http://localhost:5153/api";

export const login = async (role: "Trainer" | "Student", username: string, password: string) => {
  const response = await axios.post(`${API_URL}/${role}/login`, {
    username,
    password,
  });

  // token + role + username storage
 localStorage.setItem("token", response.data.token);
localStorage.setItem("role", response.data.role); // "Trainer" / "Student"
localStorage.setItem("username", response.data.username);


  return response.data;
};

export const register = async (role: "Trainer" | "Student", formData: FormData) => {
  const response = await axios.post(`${API_URL}/${role}/register`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
