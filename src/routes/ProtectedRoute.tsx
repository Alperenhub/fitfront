// ProtectedRoute.tsx
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }: { children: JSX.Element, role: string }) {
  const tokenKey = role.toLowerCase() === "student" ? "studentToken" : "trainerToken";
  const token = localStorage.getItem(tokenKey);
  const userRole = localStorage.getItem("role")?.toLowerCase();

  if (!token || userRole !== role.toLowerCase()) {
    return <Navigate to={`/${role.toLowerCase()}/login`} replace />;
  }

  return children;
}
