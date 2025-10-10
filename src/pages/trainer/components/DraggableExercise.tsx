import { forwardRef } from "react";
import { useDrag } from "react-dnd";
import { Paper } from "@mui/material";

export type Exercise = { id: number; name: string; bodyPart: string; notes?: string };

const DraggableExercise = forwardRef<HTMLDivElement, { exercise: Exercise }>(
  ({ exercise }, ref) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "EXERCISE",
      item: exercise,
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }));

    const dragRef = (node: HTMLDivElement | null) => {
      drag(node);
      if (ref) {
        if (typeof ref === "function") ref(node);
        else (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    return (
      <Paper
        ref={dragRef}
        sx={{
          p: 1,
          mb: 1,
          cursor: "move",
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        {exercise.name} ({exercise.bodyPart})
      </Paper>
    );
  }
);

DraggableExercise.displayName = "DraggableExercise";
export default DraggableExercise;
