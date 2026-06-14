import React, { useState } from "react";
import { Lock, Eye, EyeOff, Save } from "lucide-react";
import { useTheme } from "../Component/ThemeContext";
import api from "../api/api";

const SettingsPage = () => {
  const { isDarkMode } = useTheme();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const toggleShow = (field) => {
    setShow({
      ...show,
      [field]: !show[field],
    });
  };

  const validate = () => {
    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return "All fields are required";
    }

    if (currentPassword.length < 6) {
      return "Current password must be at least 6 characters";
    }

    if (newPassword.length < 6) {
      return "New password must be at least 6 characters";
    }

    if (newPassword === currentPassword) {
      return "New password must be different from current password";
    }

    if (newPassword !== confirmPassword) {
      return "Passwords do not match";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await api.put(
        "/admin/update-password",
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      setSuccess(
        res.data.message || "Password updated successfully"
      );

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p
            className={
              isDarkMode
                ? "text-gray-300 mt-1"
                : "text-gray-500 mt-1"
            }
          >
            Update your admin password
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`rounded-3xl p-6 shadow-sm space-y-5 border transition-colors duration-300 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="p-3 rounded-xl bg-green-100 text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="text-sm font-medium">
              Current Password
            </label>

            <div className="relative mt-2">
              <Lock
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                type={show.current ? "text" : "password"}
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                className={`w-full pl-10 pr-10 py-3 rounded-xl outline-none transition ${
                  isDarkMode
                    ? "bg-gray-700 text-white focus:ring-2 focus:ring-red-500"
                    : "bg-gray-50 text-gray-900 focus:ring-2 focus:ring-red-400"
                }`}
              />

              <button
                type="button"
                onClick={() => toggleShow("current")}
                className="absolute right-3 top-3 text-gray-500"
              >
                {show.current ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium">
              New Password
            </label>

            <div className="relative mt-2">
              <Lock
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                type={show.new ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className={`w-full pl-10 pr-10 py-3 rounded-xl outline-none transition ${
                  isDarkMode
                    ? "bg-gray-700 text-white focus:ring-2 focus:ring-red-500"
                    : "bg-gray-50 text-gray-900 focus:ring-2 focus:ring-red-400"
                }`}
              />

              <button
                type="button"
                onClick={() => toggleShow("new")}
                className="absolute right-3 top-3 text-gray-500"
              >
                {show.new ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium">
              Confirm Password
            </label>

            <div className="relative mt-2">
              <Lock
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                type={show.confirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className={`w-full pl-10 pr-10 py-3 rounded-xl outline-none transition ${
                  isDarkMode
                    ? "bg-gray-700 text-white focus:ring-2 focus:ring-red-500"
                    : "bg-gray-50 text-gray-900 focus:ring-2 focus:ring-red-400"
                }`}
              />

              <button
                type="button"
                onClick={() => toggleShow("confirm")}
                className="absolute right-3 top-3 text-gray-500"
              >
                {show.confirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-2xl transition disabled:opacity-60"
          >
            <Save size={18} />
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default SettingsPage;