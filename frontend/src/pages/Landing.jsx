import React from "react";
import { Link } from "react-router-dom";
import { 
  FaCode, FaRobot, FaChartLine, FaProjectDiagram, FaUsers, FaBook, 
  FaUserPlus, FaTasks, FaLightbulb, FaTrophy, FaUserCog, FaFileAlt 
} from "react-icons/fa";

export default function Landing() {
  const features = [
    { title: "Live Code", desc: "Run code instantly inside the browser with zero setup.", color: "teal", icon: <FaCode /> },
    { title: "AI Feedback", desc: "Get suggestions, hints, and code reviews powered by AI.", color: "purple", icon: <FaRobot /> },
    { title: "Progress Tracking", desc: "Earn badges, track performance, and visualize your growth.", color: "teal", icon: <FaChartLine /> },
    { title: "Projects & Challenges", desc: "Work on real projects to solidify your skills.", color: "purple", icon: <FaProjectDiagram /> },
    { title: "Community", desc: "Join a community of like-minded developers.", color: "teal", icon: <FaUsers /> },
    { title: "Resources", desc: "Access guides, tutorials, and cheat sheets.", color: "purple", icon: <FaBook /> },
  ];

  const steps = [
    { step: 1, title: "Sign Up", desc: "Create an account in seconds and get started.", icon: <FaUserPlus /> },
    { step: 2, title: "Solve Challenges", desc: "Practice coding problems and real projects.", icon: <FaTasks /> },
    { step: 3, title: "Get Feedback", desc: "Receive AI-powered hints, tips, and progress tracking.", icon: <FaLightbulb /> },
  ];

  const testimonials = [
    { name: "Faiqa", quote: "This platform improved my coding skills dramatically!", color: "teal" },
    { name: "Rida", quote: "AI feedback is amazing, saved me hours of debugging.", color: "purple" },
    { name: "Hareem", quote: "Tracking my progress keeps me motivated every day.", color: "teal" },
  ];

  const quickActions = [
    { 
      title: "Continue Solving Challenges", 
      description: "Pick up where you left off",
      icon: <FaCode className="text-2xl" />, 
      color: "teal"
    },
    { 
      title: "View Submissions", 
      description: "Track your learning journey",
      icon: <FaChartLine className="text-2xl" />, 
      color: "purple"
    },
    { 
      title: "Request AI Feedback", 
      description: "Get code reviews instantly",
      icon: <FaRobot className="text-2xl" />, 
      color: "teal"
    },
    { 
      title: "Profile Settings", 
      description: "Manage your account",
      icon: <FaUserCog className="text-2xl" />, 
      color: "purple"
    }
  ];

  const shadowGlow = {
    teal: "hover:shadow-[0_0_25px_5px_rgba(20,184,166,0.5)]",
    purple: "hover:shadow-[0_0_25px_5px_rgba(167,139,250,0.5)]",
  };

  return (
    <div className="relative w-full bg-navy text-white overflow-x-hidden">

      {/* ====== HERO ====== */}
      <section className="relative z-10 px-6 pt-28 pb-20 max-w-6xl mx-auto text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-wide animate-fadeIn">
          <span className="text-purple">Level Up</span> Your <span className="text-teal">Coding Skills</span> 
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed mt-4">
          Practice challenges, build projects, get AI-powered feedback, and track your progress —
          all in one sleek platform designed for modern developers.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link
            to="/signup"
            className="px-10 py-3 bg-navyDark border border-teal/30 text-white font-semibold rounded-xl hover:text-purple transition-all duration-300"
          >
            Get Started →
          </Link>
          <Link
            to="/login"
            className="px-10 py-3 bg-navyDark border border-teal/30 text-white font-semibold rounded-xl hover:text-purple transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* ====== QUICK ACTIONS ====== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mt-8 text-center py-16">
        <h2 className="text-4xl font-extrabold text-white mb-12">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl bg-navyDark/70 border border-${action.color}/20 shadow hover:-translate-y-2 transform transition-all duration-300 flex flex-col items-center gap-4 text-center group ${shadowGlow[action.color]}`}
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
      </section>

      {/* ====== FEATURES ====== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mt-6 text-center py-16">
        <h2 className="text-4xl font-extrabold text-white mb-12">Features of Our Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((feature, i) => (
          <div
            key={i}
            className={`relative p-6 rounded-xl border border-gray-700 bg-navyDark/70 cursor-pointer transform hover:-translate-y-2 transition-all duration-300 shadow-lg ${shadowGlow[feature.color]}`}
          >
            <div className="flex items-center justify-center text-3xl mb-3 text-${feature.color}">
              {feature.icon}
            </div>
            <h3 className={`text-2xl font-bold text-${feature.color} mb-2`}>{feature.title}</h3>
            <p className="text-gray-300">{feature.desc}</p>
          </div>
        ))}
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mt-8 text-center py-16">
        <h2 className="text-4xl font-extrabold text-white mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((item, i) => (
            <div
              key={i}
              className={`backdrop-blur-sm p-8 rounded-xl border border-gray-700 shadow-lg transform hover:-translate-y-2 transition-all duration-300 cursor-pointer ${shadowGlow[i % 2 === 0 ? "purple" : "teal"]} ${i % 2 === 0 ? "bg-purple/20" : "bg-teal/20"}`}
            >
              <div className="text-4xl font-bold text-white mb-4">{item.icon}</div>
              <div className="text-4xl font-bold text-white mb-4">{item.step}</div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mt-8 text-center py-16">
        <h2 className="text-4xl font-extrabold text-white mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {testimonials.map((user, i) => (
          <div
            key={i}
            className={`relative p-6 rounded-xl border border-gray-700 bg-navyDark/50 cursor-pointer transform hover:-translate-y-2 transition-all duration-300 shadow-lg ${shadowGlow[user.color]}`}
          >
            <p className="italic text-gray-300">"{user.quote}"</p>
            <p className="mt-4 font-bold text-purple">{user.name}</p>
          </div>
        ))}
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="relative z-10 mt-16 text-center px-6 py-16">
        <h2 className="text-4xl font-extrabold mb-12">Ready to Level Up?</h2>
        <Link
          to="/signup"
          className="px-12 py-4 bg-teal text-black font-bold text-xl rounded-xl shadow-lg hover:bg-purple hover:text-white transition-all duration-300"
        >
          Get Started Now →
        </Link>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="relative z-10 mt-32 py-12 px-6 bg-navyDark text-gray-400 text-center">
        <p>© 2025 Devnest. All rights reserved.</p>
        <p className="mt-2">
          <Link to="/terms" className="hover:text-teal transition">Terms</Link> | 
          <Link to="/privacy" className="ml-2 hover:text-teal transition">Privacy</Link>
        </p>
      </footer>
    </div>
  );
}