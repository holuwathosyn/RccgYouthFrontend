import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Message from "./SendMessageToUsers";
import ListUsers from "./ListOfUsers";
import Layout from "./Adminlayout";
import Settings from "./settings";

import { useAuth } from "../Context/AuthContext";

export default function AdminRoute() {
  const { admin, loading } = useAuth();

  // 🔥 IMPORTANT: wait for auth check before redirecting
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // 🔐 BLOCK ACCESS IF NOT LOGGED IN
  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      {/* Layout wrapper */}
      <Route path="/" element={<Layout />}>
        
        {/* Admin Pages */}
        <Route path="home" element={<ListUsers />} />
        <Route path="message" element={<Message />} />
        <Route path="settings" element={<Settings />} />
        
      </Route>
    </Routes>
  );
}