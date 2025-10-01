import { createBrowserRouter, Navigate, replace } from "react-router-dom";
import App from "../App";
import SelectRolePage from "../pages/SelectRolePage";
import StudentLogin from "../pages/student/StudentLogin";
import StudentRegister from "../pages/student/StudentRegister";
import StudentDashboard from "../pages/student/StudentDashboard";
import TrainerLogin from "../pages/trainer/TrainerLogin";
import TrainerRegister from "../pages/trainer/TrainerRegister";
import TrainerDashboard from "../pages/trainer/TrainerDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLogin from "../pages/admin/AdminLogin";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role")?.toLowerCase(); // normalize

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: token ? (
          role === "trainer" ? (
            <Navigate to="/trainer/dashboard" replace />
          ) : (
            <Navigate to="/student/dashboard" replace />
          )
        ) : (
          <Navigate to="/select-role" replace />
        ),
      },

      { path: "/select-role", element: <SelectRolePage /> },
      { path: "student/login", element: <StudentLogin /> },
      { path: "student/register", element: <StudentRegister /> },
      { path: "trainer/login", element: <TrainerLogin /> },
      { path: "trainer/register", element: <TrainerRegister /> },
      { path: "admin/login", element: <AdminLogin /> },



      { path: "student/dashboard", element: (
      <ProtectedRoute role="student">
      <StudentDashboard />
      </ProtectedRoute>
    ) },
      { path: "trainer/dashboard", element: (
        <ProtectedRoute role="trainer">
        <TrainerDashboard />
        </ProtectedRoute>
     )},
      { path: "admin/dashboard", element: (
        <ProtectedRoute role="admin">
        <AdminDashboard />
        </ProtectedRoute>
     )},


    ],
  },
]);

export default router;
