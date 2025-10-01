import {
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  Grid,
  Box,
  Link,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../services/authService";

export default function TrainerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await login("Trainer", username, password);

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
    <Container maxWidth={false} sx={{ minHeight: "100vh", px: 0 }}>
      <Grid container spacing={2} sx={{ minHeight: "100vh" }}>
        {/* Sol taraf - Fotoğraf */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              height: "100vh",
              width: "100%",
              position: "relative",
              backgroundImage: "url(/images/tralog.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                bgcolor: "rgba(255,255,255,0.4)",
                backdropFilter: "blur(2px)",
                zIndex: 1,
              }}
            />

            {/* Yazı */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                zIndex: 2,
              }}
            >
              <Typography variant="h2" className="text-primary">
                FitCoach
              </Typography>
              <Typography variant="h5" className="text-secondary">
                Koçluk yolculuğun burada başlıyor!
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Sağ taraf - Form */}
        <Grid size={{ xs: 12, md: 6 }} className="bg-bg-accent">
          <Box
            sx={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              px: 4,
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              className="text-primary"
              sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
            >
              Giriş Yap
            </Typography>

            <Stack spacing={2} sx={{ width: "100%", maxWidth: 400 }}>
              <TextField
                label="Kullanıcı adı"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Şifre"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#ee3141",
                  color: "white",
                }}
                fullWidth
                onClick={handleLogin}
              >
                Giriş Yap
              </Button>
            </Stack>

            <Typography sx={{ mt: 2 }}>
              Hesabın yok mu?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/trainer/register")}
                sx={{ fontWeight: 600, color: "#f43f5e" }}
              >
                Kayıt ol
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
