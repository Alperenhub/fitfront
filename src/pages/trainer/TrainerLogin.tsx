import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { login } from "../../services/authService";
import { toast } from "react-toastify";

export default function TrainerLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await login("Trainer", username, password);

      // backend zaten role dönüyor
     if (data.role?.toLowerCase() === "trainer") {
  navigate("/trainer/dashboard");
} else {
  alert("Bu kullanıcı trainer değil!");
}

    } catch (err: any) {
      setPassword("");
      toast.error("Kullanıcı adı veya şifre hatalı");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Trainer Login
        </Typography>
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
        <Button
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate("/trainer/register")}
        >
          Go to Register
        </Button>
      </Box>
    </Container>
  );
}
