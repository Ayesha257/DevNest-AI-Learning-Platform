// src/pages/VerifyEmail.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmEmail } from "../api/auth";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const oobCode = searchParams.get("oobCode");
    if (!oobCode) return navigate("/login");

    confirmEmail(oobCode)
      .then(() => {
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch(() => {});
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-teal mb-4">Email Verified!</h1>
        <p className="text-xl">Redirecting you to login...</p>
      </div>
    </div>
  );
}