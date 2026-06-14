import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const err = {};

    if (!form.email.trim()) err.email = "Email is required";
    if (!form.password.trim()) err.password = "Password is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!validate()) {
      toast.error("Fill all required fields");
      return;
    }

    setLoading(true);

    try {
      // 🔥 IMPORTANT: use context login
      const res = await login(form.email, form.password);

      if (!res?.success) {
        toast.error(res?.message || "Login failed");
        return;
      }

      toast.success("Login successful");

      // 🔥 immediate navigation (NO delay needed anymore)
      navigate("/admin/home", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative">

      {loading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl flex items-center gap-3">
            <Loader2 className="animate-spin text-red-600" />
            Signing you in...
          </div>
        </div>
      )}

      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-600 rounded-full mx-auto flex items-center justify-center text-white">
            <ShieldCheck size={38} />
          </div>
          <h1 className="mt-4 text-2xl font-bold">
            RCCG Glory of God
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl space-y-5">

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded-xl"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded-xl pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white p-3 rounded-xl"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm">
            Don't have account? <Link to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
}