import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Home,
  Inbox,
  Send,
  User,
  LogOut,
} from "lucide-react";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Dashboard", to: "/dashboard", icon: Home },
    { name: "Inbox", to: "/tasks-to-me", icon: Inbox },
    { name: "Outbox", to: "/tasks-by-me", icon: Send },
  ];

  return (
    <>
      {/* ─── TOP HEADER ─── */}
      <header className="header-container">
        <div className="header-content">

          {/* Logo */}
          <Link to="/dashboard" className="header-logo">
            <motion.div
              className="logo-icon"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <CheckSquare size={28} />
            </motion.div>
            <span className="logo-text">
              Task<span className="logo-highlight">Board</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header-nav">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${isActive(link.to) ? "nav-link-active" : ""}`}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info + Logout */}
          <div className="header-actions">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="user-profile"
              onClick={() => navigate("/profile")}
            >
              <div className="user-avatar">
                <User size={16} />
              </div>
              <span className="user-name">{user?.name}</span>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="logout-btn"
            >
              <LogOut size={18} />
              <span className="logout-text">Logout</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* ─── MOBILE BOTTOM NAVIGATION ─── */}
      <nav className="mobile-bottom-nav">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav-item ${active ? "mobile-nav-active" : ""}`}
            >
              {active && <motion.div className="mobile-nav-bg" layoutId="mobile-nav-bg" />}
              <Icon size={22} />
              <span className="mobile-nav-label">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        /* =============================================
           TOP HEADER
        ============================================= */
        .header-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        /* ── Logo ── */
        .header-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
          transition: transform 0.3s;
        }
        .header-logo:hover { transform: translateY(-2px); }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
          flex-shrink: 0;
        }

        .logo-text {
          font-size: 26px;
          font-weight: 900;
          color: white;
          letter-spacing: -0.5px;
          white-space: nowrap;
        }
        .logo-highlight {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Desktop Navigation ── */
        .header-nav {
          display: flex;
          gap: 8px;
          flex: 1;
          justify-content: center;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid transparent;
          color: rgba(255, 255, 255, 0.7);
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border-color: rgba(139, 92, 246, 0.3);
          transform: translateY(-2px);
        }
        .nav-link-active {
          background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2));
          border-color: rgba(139, 92, 246, 0.5);
          color: white;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        /* ── Header Actions ── */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .user-profile:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .user-avatar {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .user-name {
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
          transition: all 0.3s;
          white-space: nowrap;
        }
        .logout-btn:hover {
          box-shadow: 0 6px 24px rgba(239, 68, 68, 0.5);
          transform: translateY(-2px);
        }

        /* =============================================
           MOBILE BOTTOM NAVIGATION
        ============================================= */
        .mobile-bottom-nav {
          display: none;  /* hidden on desktop */
        }

        /* =============================================
           RESPONSIVE BREAKPOINTS
        ============================================= */

        /* Tablet: shrink nav text */
        @media (max-width: 1024px) {
          .header-nav { gap: 4px; }
          .nav-link { padding: 8px 14px; font-size: 14px; }
        }

        /* Small tablet: hide nav text, show icons only */
        @media (max-width: 860px) {
          .nav-link span { display: none; }
          .nav-link { padding: 10px 14px; }
          .user-name { display: none; }
          .logout-text { display: none; }
          .logout-btn { padding: 10px 12px; }
          .user-profile { padding: 8px 10px; }
        }

        /* Mobile: hide desktop nav, show bottom nav */
        @media (max-width: 640px) {
          .header-content {
            padding: 12px 16px;
          }

          /* Hide desktop nav completely on mobile */
          .header-nav {
            display: none;
          }

          /* Show only logo + actions on top bar */
          .logo-text { font-size: 22px; }
          .logo-icon { width: 36px; height: 36px; }

          /* Show mobile bottom nav */
          .mobile-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(15, 23, 42, 0.97);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid rgba(139, 92, 246, 0.25);
            box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.3);
            padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
            justify-content: space-around;
            align-items: center;
          }

          .mobile-nav-item {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            flex: 1;
            padding: 6px 4px;
            text-decoration: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 11px;
            font-weight: 600;
            transition: color 0.25s;
            border-radius: 12px;
            margin: 0 4px;
          }

          .mobile-nav-item:hover {
            color: rgba(255, 255, 255, 0.8);
          }

          .mobile-nav-active {
            color: #a78bfa;
          }

          .mobile-nav-bg {
            position: absolute;
            inset: 0;
            border-radius: 12px;
            background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.2));
            border: 1px solid rgba(139, 92, 246, 0.35);
            z-index: -1;
          }

          .mobile-nav-label {
            letter-spacing: 0.2px;
          }

          /* Add bottom padding to page body so content isn't hidden behind nav */
          /* Add this class to your main content wrapper */
          /* .main-content { padding-bottom: 80px; } */
        }

        /* Extra small phones */
        @media (max-width: 380px) {
          .logo-text { font-size: 20px; }
          .mobile-nav-item { font-size: 10px; gap: 3px; }
        }
      `}</style>
    </>
  );
};

export default Header;