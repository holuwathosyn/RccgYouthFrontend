import React, { useState } from "react";
import { Bell, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "../Component/ThemeContext";
import { useAuth } from "../Context/AuthContext"; // ✅ FIXED PATH

export default function AdminNavbar({ onMenuClick }) {
  const { isDarkMode, toggleTheme } = useTheme();

  // ✅ SAFE FALLBACK (prevents crash if auth is temporarily null)
  const auth = useAuth();
  const admin = auth?.admin;
  const logout = auth?.logout;

  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    try {
      await logout?.();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
          >
            <Menu size={22} />
          </button>

          <div>
            <h1 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">
              Dashboard
            </h1>

            <p className="hidden md:block text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              Youth Admin Portal
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-amber-400" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button>

          {/* NOTIFICATION */}
          <button className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />

            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
          </button>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow-md transition-transform hover:scale-105"
            >
              {admin?.fullName?.charAt(0)?.toUpperCase() || "A"}
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl p-4 z-50">

                <p className="font-bold text-gray-900 dark:text-white">
                  {admin?.fullName || "Administrator"}
                </p>

                <p className="text-sm text-gray-500">
                  {admin?.role || "Church Admin"}
                </p>

                <p className="text-xs text-gray-400 mt-1 break-all">
                  {admin?.email || "No email found"}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 font-semibold hover:text-red-700"
                  >
                    Sign Out
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}