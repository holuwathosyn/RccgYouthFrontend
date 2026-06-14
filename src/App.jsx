import React from "react";
import { Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./Component/ThemeContext";
import { AuthProvider } from "./Context/AuthContext"; // FIXED CASE

import RegistrationForm from "./Registration/RegistrationPage";
import AdminRoute from "./AdminDashboard/AdminRoute";
import Login from "./Auth/loginin";
import Register from "./Auth/register";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />

          {/* ADMIN (PROTECTED) */}
          <Route path="/admin/*" element={<AdminRoute />} />

        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}