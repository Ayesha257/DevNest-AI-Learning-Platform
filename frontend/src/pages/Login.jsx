// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form);
      nav("/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-navy px-4">
      <div className="max-w-md w-full bg-navyDark/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-teal/20">
        <h2 className="text-3xl font-bold text-purple mb-6 text-center">Sign in</h2>

        {err && (
          <div className="bg-red-600/80 p-3 rounded mb-4 text-center">{err}</div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            required
            value={form.email}
            onChange={(e) =>
              setForm((s) => ({ ...s, email: e.target.value }))
            }
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal focus:outline-none"
          />
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((s) => ({ ...s, password: e.target.value }))
            }
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal focus:outline-none"
          />
          <div className="flex items-center justify-between">
            <button
              disabled={loading}
              className="px-6 py-2 bg-teal hover:bg-purple transition-colors duration-300 rounded-lg font-semibold text-black shadow-md"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <Link to="/forgot" className="text-sm text-gray-300 hover:text-teal">
              Forgot?
            </Link>
          </div>
        </form>

        <p className="mt-6 text-center text-gray-400">
          No account?{" "}
          <Link to="/signup" className="text-teal hover:text-purple font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
