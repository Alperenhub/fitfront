import {
  Button,
  Container,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../services/authService";

export default function StudentLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
   try {
         const data = await login("Student", username, password);
   
         // backend zaten role dönüyor
        if (data.role?.toLowerCase() === "student") {
     navigate("/student/dashboard");
   } else {
     alert("Bu kullanıcı student değil!");
   }
   
       } catch (err: any) {
         setPassword("");
         toast.error("Kullanıcı adı veya şifre hatalı");
       }
     };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Student Login
      </Typography>
      <Stack spacing={2}>
        <TextField
  label="Username"
  fullWidth
  value={username}             // <-- ekle
  onChange={(e) => setUsername(e.target.value)}
/>

<TextField
  label="Password"
  type="password"
  fullWidth
  value={password}             // <-- ekle
  onChange={(e) => setPassword(e.target.value)}
/>

        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
         <Button
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate("/student/register")}
        >
          Go to Register
        </Button>
      </Stack>
    </Container>
  );
}
