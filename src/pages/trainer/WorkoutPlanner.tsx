import { useState, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import type { Exercise } from "./components/DraggableExercise";
import DraggableExercise from "./components/DraggableExercise";
import DayColumn from "./components/DayColumn";
import type { DayPlan } from "./components/DayColumn";
import api from "../../utils/api";

export type Student = { id: number; firstName: string; lastName: string };

export default function WorkoutPlanner({
  students,
  allExercises,
}: {
  students: Student[];
  allExercises: Exercise[];
}) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchText, setSearchText] = useState("");
  const [bodyFilter, setBodyFilter] = useState("");
  const [plan, setPlan] = useState<DayPlan[]>(
    ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => ({ day, exercises: [] }))
  );

  const filteredExercises = useMemo(() => {
    return allExercises.filter(
      (ex) =>
        ex.name.toLowerCase().includes(searchText.toLowerCase()) &&
        (bodyFilter ? ex.bodyPart === bodyFilter : true)
    );
  }, [searchText, bodyFilter, allExercises]);

  const handleDropExercise = (exercise: Exercise, day: string) => {
    setPlan(prev =>
      prev.map(p =>
        p.day === day ? { ...p, exercises: [...p.exercises, {...exercise, notes: ""}] } : p
      )
    );
  };

  const removeExercise = (exId: number, day: string) => {
    setPlan(prev =>
      prev.map(p =>
        p.day === day ? { ...p, exercises: p.exercises.filter(e => e.id !== exId) } : p
      )
    );
  };

  const updateNotes = (exId: number, day: string, value: string) => {
    setPlan(prev =>
      prev.map(p =>
        p.day === day
          ? {
              ...p,
              exercises: p.exercises.map(e =>
                e.id === exId ? { ...e, notes: value } : e
              ),
            }
          : p
      )
    );
  };

const handleSavePlan = async () => {
  if (!selectedStudent) return alert("Önce öğrenci seçin!");

  try {
    // payload'ı backend zorunlu alanlarını düşünerek oluşturuyoruz
    const payload = {
      studentId: selectedStudent.id,
      Title: "Haftalık Plan",
      Description: "Omuz + Göğüs", // boş göndermiyoruz
      Exercises: plan.flatMap(p =>
        p.exercises.map((ex:any) => ({
          Name: ex.name || "Unknown",
          Notes: ex.notes || "Set x tekrar y",
          ApiInfo: ex.apiInfo || "", // backend zorunlu
          BodyPart: ex.bodyPart || "Unknown",
          Category: ex.category || "General",
          Equipment: ex.equipment || "Bodyweight",
          ImageUrl: ex.imageUrl || "",
        }))
      ),
    };

    console.log("Payload:", JSON.stringify(payload, null, 2)); // debug için

    await api.post("/WorkoutPlan/create", payload);
    alert("Plan kaydedildi!");
  } catch (err: any) {
    console.error("Plan kaydederken hata:", err.response || err);
    alert(
      err.response?.data?.title ||
        "Kaydederken hata oluştu. Konsolu kontrol et."
    );
  }
};


  const uniqueBodyParts = Array.from(new Set(allExercises.map(ex => ex.bodyPart)));

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Öğrenci Seç</InputLabel>
          <Select
            value={selectedStudent?.id || ""}
            onChange={(e) =>
              setSelectedStudent(students.find(s => s.id === Number(e.target.value)) || null)
            }
          >
            {students.map(s => (
              <MenuItem key={s.id} value={s.id}>
                {s.firstName} {s.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Hareket Ara"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Body Part</InputLabel>
          <Select
            value={bodyFilter}
            onChange={(e) => setBodyFilter(e.target.value)}
            label="Body Part"
          >
            <MenuItem value="">Tümü</MenuItem>
            {uniqueBodyParts.map(bp => (
              <MenuItem key={bp} value={bp}>{bp}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box display="flex">
        {/* Exercise List */}
        <Box sx={{ width: 200, mr: 2, maxHeight: 400, overflowY: "auto", border: "1px solid gray", borderRadius: 1, p: 1 }}>
          {filteredExercises.map(ex => (
            <DraggableExercise key={ex.id} exercise={ex} />
          ))}
        </Box>

        {/* Day Columns */}
        <Box sx={{ display: "flex", flexWrap: "wrap", width: 880 }}>
          {plan.map(dayPlan => (
            <DayColumn
              key={dayPlan.day}
              dayPlan={dayPlan}
              onDropExercise={handleDropExercise}
              removeExercise={removeExercise}
              updateNotes={updateNotes}
            />
          ))}
        </Box>
      </Box>

      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSavePlan}>
        Kaydet
      </Button>
    </DndProvider>
  );
}
