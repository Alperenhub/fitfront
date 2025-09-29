import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5153/api/Admin/login", {
        username,
        password,
      });

      // backend’den gelen veriler
      const { token, username: user } = res.data;

      // token ve role sakla
      localStorage.setItem("token", token);
      localStorage.setItem("role", "Admin"); // backend zaten claim'de Admin veriyor
      localStorage.setItem("username", user);

      navigate("/admin/dashboard",{replace:true});
    } catch (err: any) {
      setPassword("");
      toast.error("Kullanıcı adı veya şifre hatalı");
    }
  };
  

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        ADMİN
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </Stack>
    </Container>
  );
}
