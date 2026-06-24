import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav className="w-full bg-navyDark/50 backdrop-blur-lg border-b border-teal/30">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          <span className="text-teal">Dev</span>
          <span className="text-purple">Nest</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">

          {/* Dashboard */}
          <Link
            to="/dashboard"
            className="px-4 py-1.5 rounded-md border border-white/10 hover:border-teal/60 transition"
          >
            Dashboard
          </Link>

          {!user ? (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-md border border-white/10 hover:border-teal/60 transition"
              >
                Login
              </Link>

              {/* Signup */}
              <Link
                to="/signup"
                className="px-4 py-1.5 rounded-md bg-teal text-black font-semibold hover:bg-purple hover:text-white transition"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              {/* Profile */}
              <Link
                to={`/profile/${user.uid}`}
                className="px-4 py-1.5 rounded-md bg-purple/40 hover:bg-purple/60 transition"
              >
                Profile
              </Link>

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  nav("/");
                }}
                className="px-4 py-1.5 rounded-md border border-white/10 hover:border-teal/60 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
