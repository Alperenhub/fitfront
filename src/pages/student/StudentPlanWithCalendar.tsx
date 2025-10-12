//StudentPlanWithCalendar.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Modal,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Exercise = {
  id: number;
  name: string;
  notes?: string;
  videoUrl?: string;
  repetitions?: number;
  sets?: number;
};

type DayPlan = {
  day: string; // Pazartesi, Salı, ...
  exercises: Exercise[];
};

type WorkoutPlanProps = {
  title: string;
  description: string;
  plan: DayPlan[];
};

const WEEK_DAYS = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];

export default function StudentPlanWithCalendar({ title, description, plan }: WorkoutPlanProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Planı hafta günlerine göre map'le, olmayan günleri boş bırak
  const weekPlan = WEEK_DAYS.map((day) => {
    const dayPlan = plan.find((p) => p.day === day);
    return {
      day,
      exercises: dayPlan?.exercises || []
    };
  });

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5">{title}</Typography>
      <Typography sx={{ mb: 2 }}>{description}</Typography>

      <Grid container spacing={2}>
        {weekPlan.map((dayPlan) => (
          <Grid key={dayPlan.day} sx={{xs:12,sm:6,md:3}}>
            <Card sx={{ minHeight: 150 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {dayPlan.day}
                </Typography>

                {dayPlan.exercises.length === 0 ? (
                  <Typography sx={{ fontStyle: "italic" }}>Egzersiz yok</Typography>
                ) : (
                  dayPlan.exercises.map((ex) => (
                    <Typography
                      key={ex.id}
                      sx={{
                        cursor: ex.videoUrl ? "pointer" : "default",
                        mb: 0.5,
                        "&:hover": { color: ex.videoUrl ? "blue" : "inherit" },
                      }}
                      onClick={() => ex.videoUrl && setSelectedExercise(ex)}
                    >
                      {ex.name} (
                      {ex.repetitions ?? 0}x{ex.sets ?? 0} - {ex.notes ?? "Set x tekrar y"})
                    </Typography>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for video */}
      <Modal
        open={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
        aria-labelledby="exercise-modal-title"
        aria-describedby="exercise-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            width: { xs: "90%", sm: 500 },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">{selectedExercise?.name}</Typography>
            <IconButton onClick={() => setSelectedExercise(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedExercise?.videoUrl ? (
            <video
              src={selectedExercise.videoUrl}
              controls
              autoPlay
              style={{ width: "100%" }}
            />
          ) : (
            <Typography>Video yok</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
