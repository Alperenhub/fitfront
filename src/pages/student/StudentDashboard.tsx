import { useState } from "react";
import { Button, TextField, Typography, Box, Container } from "@mui/material";
import api from "../../utils/api";
import { handleLogout } from "../../functions/Logout";
import { useNavigate } from "react-router";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const logout = () => handleLogout("student", navigate);

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const joinTrainer = async () => {
    if (!code.trim()) {
      setMessage("Lütfen geçerli bir kod girin.");
      return;
    }

    try {
      // sadece { code } gönderiyoruz
      const res = await api.post("/Student/join", { code: code.trim() });
      setMessage(
        `Başarıyla eşleştirildiniz! TrainerId: ${res.data.trainerId}. Kalan kota: ${res.data.remainingQuota}`
      );
      setCode(""); // kodu temizle
    } catch (err: any) {
      // Backend’den gelen hatayı kullanıcıya göster
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Eğer ModelState hatası varsa
        const errors = Object.values(err.response.data.errors).flat().join(" ");
        setMessage(errors);
      } else {
        setMessage("Beklenmeyen bir hata oluştu.");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4">Welcome, Student!</Typography>

      <Box mt={3}>
        <TextField
          fullWidth
          label="Trainer Kodunu Gir"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" fullWidth onClick={joinTrainer}>
          Join
        </Button>
      </Box>

      {message && (
        <Typography
          sx={{ mt: 2, color: message.includes("Başarı") ? "green" : "red" }}
        >
          {message}
        </Typography>
      )}

      <Box mt={5}>
        <Button variant="contained" color="error" fullWidth onClick={logout}>
          Çıkış Yap
        </Button>
      </Box>
    </Container>
  );
}
