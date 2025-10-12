import { useState, useEffect } from "react";
import { Button, TextField, Typography, Box, Container } from "@mui/material";
import api from "../../utils/api";
import { handleLogout } from "../../functions/Logout";
import { useNavigate } from "react-router";
import StudentPlanWithCalendar from "./StudentPlanWithCalendar";

type Exercise = {
  id: number;
  name: string;
  notes?: string;
  videoUrl?: string;
  repetitions?: number;
  sets?: number;
};

type DayPlan = {
  day: string;
  exercises: Exercise[];
};

type WorkoutPlan = {
  id: number;
  title: string;
  description: string;
  plan: DayPlan[];
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const logout = () => handleLogout("student", navigate);

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        console.log("📦 Planlar getiriliyor...");
        const res = await api.get("/WorkoutPlan/my-plans");
        console.log("✅ API yanıtı:", res.data);

        // Backend "Henüz plan yok" mesajı dönerse
        if (res.data?.message === "Henüz plan yok.") {
          setPlans([]);
        } else if (Array.isArray(res.data)) {
          setPlans(
            res.data.map((p: any) => ({
              id: p.id,
              title: p.title,
              description: p.description,
              plan: p.plan || [],
            }))
          );
        } else {
          console.warn("⚠️ Plan listesi beklenmedik formatta:", res.data);
          setPlans([]);
        }
      } catch (err: any) {
        console.error("❌ Planlar alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const joinTrainer = async () => {
    if (!code.trim()) {
      setMessage("Lütfen geçerli bir kod girin.");
      return;
    }

    try {
      console.log("🔑 Trainer join isteği gönderiliyor:", code);
      const res = await api.post("/Student/join", { code: code.trim() });
      console.log("✅ Trainer join yanıtı:", res.data);

      setMessage(
        `Başarıyla eşleştirildiniz! TrainerId: ${res.data.trainerId}. Kalan kota: ${res.data.remainingQuota}`
      );
      setCode("");
    } catch (err: any) {
      console.error("❌ Trainer join hatası:", err);
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat().join(" ");
        setMessage(errors);
      } else {
        setMessage("Beklenmeyen bir hata oluştu.");
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4">Welcome, Student!</Typography>

      {/* Trainer join alanı */}
      <Box mt={3} mb={3}>
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
        {message && (
          <Typography sx={{ mt: 2, color: message.includes("Başarı") ? "green" : "red" }}>
            {message}
          </Typography>
        )}
      </Box>

      {/* Plan listesi */}
      <Box mt={5}>
        {loading ? (
          <Typography sx={{ mt: 2, color: "gray" }}>📦 Planlar yükleniyor...</Typography>
        ) : plans.length > 0 ? (
          plans.map((plan) => (
            <StudentPlanWithCalendar
              key={plan.id}
              title={plan.title}
              description={plan.description}
              plan={plan.plan}
            />
          ))
        ) : (
          <Typography sx={{ mt: 2, color: "gray" }}>Henüz plan yok</Typography>
        )}
      </Box>

      {/* Logout butonu */}
      <Box mt={5}>
        <Button variant="contained" color="error" fullWidth onClick={logout}>
          Çıkış Yap
        </Button>
      </Box>
    </Container>
  );
}
