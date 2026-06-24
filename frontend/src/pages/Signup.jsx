import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signup(form);
      nav("/login"); // after signup, navigate to login
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-navy px-4">
      <div className="max-w-md w-full bg-navyDark/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-teal/20">
        <h2 className="text-3xl font-bold text-purple mb-6 text-center">Create account</h2>

        {err && (
          <div className="bg-red-600/80 p-3 rounded mb-4 text-center">{err}</div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            required
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))}
            className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal focus:outline-none"
          />
          <input
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))}
            className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal focus:outline-none"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm(s => ({ ...s, password: e.target.value }))}
            className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal focus:outline-none"
          />

          <button
            disabled={loading}
            className="w-full px-6 py-2 bg-teal hover:bg-purple transition-colors duration-300 rounded-lg font-semibold text-black shadow-md"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-teal hover:text-purple font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
