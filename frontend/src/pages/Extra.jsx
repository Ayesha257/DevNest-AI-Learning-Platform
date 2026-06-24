import React from "react";
import { useNavigate } from "react-router-dom";
import { FaComments, FaBell, FaInbox } from "react-icons/fa";

export default function Extra() {
  const navigate = useNavigate();

  const shadowGlow = {
    teal: "hover:shadow-[0_0_25px_5px_rgba(0,128,126,0.5)]",
    purple: "hover:shadow-[0_0_25px_5px_rgba(142,68,173,0.5)]",
  };

  const extraOptions = [
    {
      title: "Forum",
      description: "Join discussions and connect with community",
      icon: <FaComments className="text-4xl" />,
      color: "teal",
      action: () => navigate("/forum"),
      path: "/forum"
    },
    {
      title: "Notifications",
      description: "Stay updated with latest alerts",
      icon: <FaBell className="text-4xl" />,
      color: "purple",
      action: () => navigate("/notifications"),
      path: "/notifications"
    },
    {
      title: "Inbox",
      description: "Check your messages and updates",
      icon: <FaInbox className="text-4xl" />,
      color: "teal",
      action: () => navigate("/inbox"),
      path: "/inbox"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-navy text-white px-4 md:px-12 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center animate-fadeSlideUp">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="text-teal">Extra</span> <span className="text-purple">Features</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Explore additional features to enhance your experience
          </p>
        </div>

        {/* Extra Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {extraOptions.map((option, index) => (
            <div
              key={index}
              onClick={option.action}
              className={`p-8 rounded-2xl bg-navyDark/80 border border-${option.color}/20 shadow-lg hover:-translate-y-2 transform transition-all duration-300 cursor-pointer animate-fadeSlideUp ${shadowGlow[option.color]}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                {/* Icon */}
                <div className={`w-20 h-20 rounded-full bg-${option.color}/20 flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
                  <div className={`text-${option.color}`}>
                    {option.icon}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {option.description}
                  </p>
                </div>

                {/* Arrow Indicator */}
                <div className={`text-${option.color} text-xl font-bold mt-2 transition-transform duration-300 group-hover:translate-x-2`}>
                  →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Dashboard Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 bg-navyDark border border-teal/30 text-white font-semibold rounded-xl hover:text-purple hover:border-purple/30 transition-all duration-300"
          >
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}