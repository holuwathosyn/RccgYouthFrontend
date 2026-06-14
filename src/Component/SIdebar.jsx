import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Send, Settings, LogOut, X } from "lucide-react";

export default function AdminSidebar({ isOpen, onClose }) {
  const navItems = [
    { to: "/admin/home", icon: <Home size={20} />, label: "Dashboard" },
  
    { to: "/admin/message", icon: <Send size={20} />, label: "Post Message" },
    { to: "/admin/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-8 md:hidden">
          <h1 className="text-lg font-extrabold text-gray-900 dark:text-white">RCCG Glory</h1>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block p-8">
          <h1 className="text-lg font-extrabold text-gray-900 dark:text-white">RCCG <span className="text-red-600">Glory</span></h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}