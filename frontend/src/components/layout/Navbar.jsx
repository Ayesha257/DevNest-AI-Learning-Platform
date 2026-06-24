import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          DevNest
        </Link>

        <div className="navbar-links">
          <Link
            to="/forum"
            className={`navbar-link ${isActive("/forum") ? "active-link" : ""}`}
          >
            Forum
          </Link>

          <Link
            to="/leaderboard"
            className={`navbar-link ${
              isActive("/leaderboard") ? "active-link" : ""
            }`}
          >
            Leaderboard
          </Link>

          <Link
            to="/badges"
            className={`navbar-link ${
              isActive("/badges") ? "active-link" : ""
            }`}
          >
            Badges
          </Link>

          <Link
            to="/notifications"
            className={`navbar-link ${
              isActive("/notifications") ? "active-link" : ""
            }`}
          >
            Notifications
          </Link>

          <Link
            to="/inbox"
            className={`navbar-link ${
              isActive("/inbox") ? "active-link" : ""
            }`}
          >
            Inbox
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




