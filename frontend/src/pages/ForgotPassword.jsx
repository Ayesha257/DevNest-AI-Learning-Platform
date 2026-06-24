import React, { useState } from "react";
import * as authApi from "../api/auth";
import { useNavigate } from "react-router-dom"; // React Router v6+

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const navigate = useNavigate(); // for programmatic navigation

  const send = async () => {
    if (!email.trim()) {
      setMsg("Please enter your email");
      return;
    }

    try {
      const res = await authApi.requestPasswordReset(email.trim());
      console.log("Reset response:", res.data);

      // Instead of redirecting, save the reset link in state
      setResetUrl(res.data.reset_link);
      setMsg("Reset link generated! Click the button below to reset password.");

    } catch (e) {
      console.error("Error sending reset:", e?.response?.data || e);
      setMsg(e?.response?.data?.detail || "Failed to request password reset");
    }
  };

  const openResetPage = () => {
    // Extract query parameters like oobCode from resetUrl
    const url = new URL(resetUrl);
    const oobCode = url.searchParams.get("oobCode");

    // Navigate to ResetPassword page and pass oobCode via state
    navigate("/reset", { state: { oobCode } });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-navy text-white px-4">
      <div className="w-full max-w-md bg-navyDark/70 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-lg">

        <h1 className="text-3xl font-extrabold text-purple mb-6 text-center">
          Forgot Password
        </h1>

        <p className="text-gray-300 text-center mb-6 text-sm">
          Enter your email and we’ll send a reset link.
        </p>

        {/* Email Input */}
        <input
          type="email"
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-teal transition"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Send Button */}
        <button
          onClick={send}
          className="w-full mt-5 bg-teal text-black font-semibold py-3 rounded-xl hover:bg-teal/80 transition"
        >
          Send Reset Link
        </button>

        {/* Message */}
        {msg && (
          <p className="text-center text-sm text-purple mt-4 break-words">{msg}</p>
        )}

        {/* Open Reset Page Button */}
        {resetUrl && (
          <button
            onClick={openResetPage}
            className="w-full mt-3 bg-purple text-black font-semibold py-3 rounded-xl hover:bg-purple/80 transition"
          >
            Open Reset Password
          </button>
        )}
      </div>
    </div>
  );
}
