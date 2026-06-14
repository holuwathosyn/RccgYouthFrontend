import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../Component/Navbar";
import AdminSidebar from "../Component/SIdebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      
      {/* Sidebar is now positioned relative to the screen */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}