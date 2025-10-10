// StudentDashboard.tsx
import { useState, useEffect } from "react";
import { Button, TextField, Typography, Box, Container } from "@mui/material";
import api from "../../utils/api";
import { handleLogout } from "../../functions/Logout";
import { useNavigate } from "react-router";
import StudentPlanWithCalendar from "./StudentPlanWithCalendar";
import {jwtDecode} from "jwt-decode";

type Exercise = {
  id: number;
  name: string;
  notes: string;
  videoUrl?: string;
};

type DayPlan = {
  day: string;
  exercises: Exercise[];
};

type WorkoutPlan = {
  title: string;
  description: string;
  plan: DayPlan[];
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const logout = () => handleLogout("student", navigate);

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);

  // Token’dan öğrenci ID’si alalım
  const getStudentId = () => {
    const token = localStorage.getItem("studentToken");
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded.nameid;
  };

  useEffect(() => {
    const fetchPlan = async () => {
      const studentId = getStudentId();
      if (!studentId) return;

      try {
        const res = await api.get(`/WorkoutPlan/student/${studentId}`);
        if (res.data && res.data.length > 0) {
          const firstPlan = res.data[0]; // ilk planı alıyoruz
          setPlan({
            title: firstPlan.title,
            description: firstPlan.description,
            plan: firstPlan.exercisesGroupedByDay || firstPlan.plan || [], 
            // backend planı günlere göre döndürüyorsa: exercisesGroupedByDay
          });
        }
      } catch (err) {
        console.error("Plan alınamadı", err);
      }
    };

    fetchPlan();
  }, []);

  const joinTrainer = async () => {
    if (!code.trim()) {
      setMessage("Lütfen geçerli bir kod girin.");
      return;
    }

    try {
      const res = await api.post("/Student/join", { code: code.trim() });
      setMessage(
        `Başarıyla eşleştirildiniz! TrainerId: ${res.data.trainerId}. Kalan kota: ${res.data.remainingQuota}`
      );
      setCode("");
    } catch (err: any) {
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
          <Typography
            sx={{ mt: 2, color: message.includes("Başarı") ? "green" : "red" }}
          >
            {message}
          </Typography>
        )}
      </Box>

      <Box mt={5}>
        <Button variant="contained" color="error" fullWidth onClick={logout}>
          Çıkış Yap
        </Button>
      </Box>

      <Box mt={5}>
        {plan ? (
          <StudentPlanWithCalendar
            title={plan.title}
            description={plan.description}
            plan={plan.plan}
          />
        ) : (
          <Typography sx={{ mt: 2 }}>Henüz plan yok</Typography>
        )}
      </Box>
    </Container>
  );
}
