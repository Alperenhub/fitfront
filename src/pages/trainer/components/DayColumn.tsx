import { Box, Paper, Typography, IconButton, TextField } from "@mui/material";
import { useDrop } from "react-dnd";
import CloseIcon from "@mui/icons-material/Close";
import type { Exercise } from "./DraggableExercise";

export type DayPlan = { day: string; exercises: Exercise[] };

export default function DayColumn({
  dayPlan,
  onDropExercise,
  removeExercise,
  updateNotes,
}: {
  dayPlan: DayPlan;
  onDropExercise: (exercise: Exercise, day: string) => void;
  removeExercise: (exId: number, day: string) => void;
  updateNotes: (exId: number, day: string, value: string) => void;
}) {
  const [, drop] = useDrop(() => ({
    accept: "EXERCISE",
    drop: (item: Exercise) => onDropExercise(item, dayPlan.day),
  }));

  return (
    <Box
      ref={drop as any}
      sx={{
        border: "1px solid gray",
        borderRadius: 1,
        p: 2,
        minHeight: 200,
        width: 200,
        m: 1,
      }}
    >
      <Typography variant="h6">{dayPlan.day}</Typography>
      {dayPlan.exercises.map((ex) => (
        <Paper
          key={`${ex.id}-${dayPlan.day}`} 
          sx={{
            p: 1,
            mb: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{ex.name} ({ex.bodyPart})</span>
            <IconButton
              size="small"
              onClick={() => removeExercise(ex.id, dayPlan.day)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <TextField
            size="small"
            placeholder="Set x tekrar"
            value={ex.notes || ""}
            onChange={(e) => updateNotes(ex.id, dayPlan.day, e.target.value)}
            sx={{ mt: 1 }}
          />
        </Paper>
      ))}
    </Box>
  );
}
