import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/auth";
import { FaCode, FaChartLine, FaRobot, FaUserCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await authApi.me(accessToken);
        setProfile(res.data);
      } catch (e) {
        setErr(e?.response?.data?.detail || e.message || "Failed to load profile");
      }
    })();
  }, [accessToken]);

  const shadowGlow = {
    teal: "hover:shadow-[0_0_25px_5px_rgba(0,128,126,0.5)]",
    purple: "hover:shadow-[0_0_25px_5px_rgba(142,68,173,0.5)]",
  };

  const quickActions = [
    { 
      title: "Continue Solving Challenges", 
      description: "Pick up where you left off",
      icon: <FaCode className="text-2xl" />, 
      color: "teal",
      action: () => navigate("/challenges"),
      path: "/challenges"
    },
    { 
      title: "View Submissions", 
      description: "Track your learning journey",
      icon: <FaChartLine className="text-2xl" />, 
      color: "purple",
      action: () => navigate("/submissions"),
      path: "/submissions"
    },
    { 
      title: "Extra", 
      description: "Get code reviews instantly",
      icon: <FaRobot className="text-2xl" />, 
      color: "teal",
      action: () => navigate("/extra"),
      path: "/extra"
    },
    { 
      title: "Profile Settings", 
      description: "Manage your account",
      icon: <FaUserCog className="text-2xl" />, 
      color: "purple",
      action: () => navigate("/profile"),
      path: "/profile"
    }
  ];

  if (err)
    return (
      <div className="p-6 bg-red-600/80 text-white rounded-xl shadow-md animate-fadeIn max-w-2xl mx-auto mt-16">
        {err}
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-navy text-white px-4 md:px-12 py-12 space-y-8">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center animate-fadeSlideUp">
        Welcome to Your Dashboard
      </h2>

      {!profile ? (
        <div className="max-w-2xl mx-auto mt-4 p-6 bg-navyDark/80 rounded-2xl shadow-lg text-teal animate-pulse">
          Loading profile...
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-8">

          {/* ===== Profile Card ===== */}
          <div
            className={`p-6 rounded-2xl bg-navyDark/80 border border-teal/20 shadow-lg transform hover:-translate-y-2 transition-all duration-300 animate-fadeSlideUp ${shadowGlow.teal}`}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-purple flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {profile.name?.charAt(0).toUpperCase() || profile.username?.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-extrabold text-teal mb-2">
                  {profile.name || profile.username}
                </h3>

                {profile.role && (
                  <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-purple/50 text-white mb-3">
                    {profile.role}
                  </span>
                )}

                {profile.bio && <p className="text-gray-300 mb-4">{profile.bio}</p>}
              </div>
            </div>
          </div>

          {/* ===== Quick Actions ===== */}
          <div
            className={`p-6 rounded-2xl bg-navyDark/80 border border-purple/20 shadow-lg transform hover:-translate-y-2 transition-all duration-300 animate-fadeSlideUp ${shadowGlow.purple}`}
          >
            <h3 className="text-2xl font-bold text-purple mb-6 text-center">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  onClick={action.action}
                  className={`p-6 rounded-xl bg-navyDark/70 border border-${action.color}/20 shadow hover:-translate-y-2 transform transition-all duration-300 cursor-pointer flex flex-col items-center gap-4 text-center group ${shadowGlow[action.color]}`}
                >
                  <div className={`w-16 h-16 rounded-full bg-${action.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`text-${action.color}`}>
                      {action.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg mb-1">{action.title}</h4>
                    <p className="text-gray-300 text-sm">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== Recent Activity ===== */}
          <div
            className={`p-6 rounded-2xl bg-navyDark/80 border border-teal/20 shadow-lg transform hover:-translate-y-2 transition-all duration-300 animate-fadeSlideUp ${shadowGlow.teal}`}
          >
            <h3 className="text-2xl font-bold text-teal mb-6 text-center">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {profile.recentActivity && profile.recentActivity.length > 0 ? (
                profile.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-navy/60 rounded-xl border border-gray-700">
                    <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center">
                      <FaCode className="text-purple" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.description}</p>
                      <p className="text-gray-400 text-sm">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FaChartLine className="text-4xl mx-auto mb-3 opacity-50" />
                  <p>No recent activity yet</p>
                  <p className="text-sm mt-2">Start solving challenges to see your activity here!</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}