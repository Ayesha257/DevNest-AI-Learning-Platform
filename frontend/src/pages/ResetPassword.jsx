import React, { useState } from "react";
import * as authApi from "../api/auth";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Extract oobCode from React Router state
  const oobCode = location.state?.oobCode;

  const submit = async () => {
    setErr("");
    setMsg("");

    if (!password.trim()) {
      setErr("Password cannot be empty");
      return;
    }

    if (!oobCode) {
      setErr("Invalid reset link. Missing OOB code.");
      return;
    }

    const payload = { oob_code: oobCode, new_password: password.trim() };
    console.log("Sending payload:", payload); // sanity check

    try {
      const res = await authApi.confirmPasswordReset(payload);
      setMsg("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (e) {
      setErr(e?.response?.data?.detail || "Password reset failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-navyDark/80 rounded-2xl shadow-lg text-center">
      <h3 className="text-2xl font-bold text-teal mb-4">Reset Password</h3>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal mb-4"
      />

      <button
        onClick={submit}
        className="w-full bg-teal text-black font-bold py-3 rounded-xl hover:bg-purple transition mb-4"
      >
        Submit
      </button>

      {msg && <p className="text-green-400">{msg}</p>}
      {err && <p className="text-red-500">{err}</p>}
    </div>
  );
}
