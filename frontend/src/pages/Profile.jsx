import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
  const { accessToken } = useAuth();
  const nav = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    username: "", // ← ADD THIS
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await authApi.me(accessToken);
        setProfile({
          name: res.data.name || "",
          email: res.data.email || "",
          bio: res.data.bio || "",
          username: res.data.username || "", // ← SAVE USERNAME HERE
        });
      } catch (e) {
        setErr("Failed to load profile");
      }
    })();
  }, [accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!profile.username) {
      setErr("Username not found. Try logging out and back in.");
      return;
    }

    setLoading(true);
    setMsg("");
    setErr("");

    try {
      await authApi.updateProfile(
        accessToken,
        profile.username, // ← USE USERNAME, NOT NAME!!!
        {
          name: profile.name,
          bio: profile.bio,
        }
      );
      setMsg("Profile updated successfully!");
      setTimeout(() => nav("/dashboard"), 1500);
    } catch (e) {
      setErr(e?.response?.data?.detail || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-navy text-white px-4 md:px-12 py-12">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
        Profile Settings
      </h2>

      {err && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-600/80 rounded-xl text-center">
          {err}
        </div>
      )}
      {msg && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-teal/80 rounded-xl text-black text-center">
          {msg}
        </div>
      )}

      <form onSubmit={handleUpdate} className="max-w-3xl mx-auto bg-navyDark/80 p-8 rounded-2xl shadow-lg space-y-6">
        {/* Username (read-only) */}
        <div>
          <label className="block mb-2 font-semibold text-purple">Username</label>
          <input
            type="text"
            value={profile.username}
            readOnly
            className="w-full p-3 rounded-lg bg-white/10 text-gray-300 cursor-not-allowed"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block mb-2 font-semibold text-teal">Full Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-teal focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-semibold text-teal">Email</label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className="w-full p-3 rounded-lg bg-white/10 text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-2 font-semibold text-purple">Bio</label>
          <textarea
            name="bio"
            value={profile.bio || ""}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us about yourself..."
            className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple focus:outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !profile.username}
          className="w-full py-3 bg-teal hover:bg-purple disabled:opacity-50 text-black font-bold rounded-xl transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}