import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Edit3,
  Save,
  X,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  Settings,
} from "lucide-react";

const ProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [view, setView] = useState("details");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showSessions, setShowSessions] = useState(false);

  // Change password state
  // ... (password states and OTP modal states remain unchanged)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpMsg, setOtpMsg] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [pendingCreds, setPendingCreds] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // Compose update change message for feedback
  const getUpdateMessage = (oldN, newN, oldE, newE) => {
    let changes = [];
    if (oldN !== newN) changes.push("Name updated");
    if (oldE !== newE) changes.push("Email updated");
    if (!changes.length) return "";
    return changes.join(" and ");
  };

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await api.patch("/user/update-profile", { name, email });
      const mailMsg = getUpdateMessage(user.name, name, user.email, email);
      setMessage(mailMsg ? mailMsg + " successfully!" : "No changes detected.");
      updateProfile({ name, email });
      setTimeout(() => setView("details"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed.");
    }
    setSaving(false);
  };

  // Password and OTP methods remain unchanged...

  // Reset password flow reset
  const resetPwdFlow = () => {
    setOtp("");
    setOtpMsg("");
    setOtpModal(false);
    setOtpVerifying(false);
    setOtpSent(false);
    setPwdSaving(false);
    setPendingCreds({});
  };

  return (
    <div className="profile-page-container">
      {/* Floating background accents */}
      <div className="profile-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="profile-card"
      >
        <div className="profile-header" style={{ position: "relative" }}>
          <motion.div
            className="profile-avatar"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring" }}
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </motion.div>
          <h2 className="profile-title">My Profile</h2>
          <p className="profile-subtitle">Manage your account settings</p>

          {/* Settings Icon Button */}
          <button
            className="settings-btn"
            title="Login Activity"
            onClick={() => setShowSessions(true)}
            aria-label="View Login Activity"
          >
            <Settings size={26} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="profile-content"
            >
              {/* Your existing profile details */}
              <div className="info-section">
                <div className="info-item">
                  <div className="info-label">
                    <User size={18} />
                    <span>Full Name</span>
                  </div>
                  <div className="info-value">{user?.name}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <Mail size={18} />
                    <span>Email Address</span>
                  </div>
                  <div className="info-value">{user?.email}</div>
                </div>
              </div>

              {/* Buttons for edit/change password */}
              <div className="button-group">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView("edit")}
                  className="btn-primary"
                >
                  <Edit3 size={18} />
                  Edit Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView("password")}
                  className="btn-secondary"
                >
                  <Key size={18} />
                  Change Password
                </motion.button>
              </div>
            </motion.div>
          )}

          {view === "edit" && (
            <motion.form
              key="edit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="profile-content"
              onSubmit={handleUpdate}
            >
              <div className="input-group">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label>Full Name</label>
              </div>

              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label>Email Address</label>
              </div>

              <div className="button-group">
                <button type="submit" className="btn-primary" disabled={saving}>
                  <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setView("details")}
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </motion.form>
          )}

          {view === "password" && (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="profile-content"
            >
              <div className="input-group">
                <Lock size={16} className="input-icon" />
                <input
                  type={showOldPwd ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <label>Old Password</label>
                <span
                  className="eye-icon"
                  onClick={() => setShowOldPwd(!showOldPwd)}
                >
                  {showOldPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              </div>

              <div className="input-group">
                <Lock size={16} className="input-icon" />
                <input
                  type={showNewPwd ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <label>New Password</label>
                <span
                  className="eye-icon"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                >
                  {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              </div>

              <div className="button-group">
                <button className="btn-primary">
                  <ShieldCheck size={16} /> Update Password
                </button>

                <button
                  className="btn-cancel"
                  onClick={() => setView("details")}
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* Edit and Password Views unchanged... */}
        </AnimatePresence>
      </motion.div>

      {/* OTP Modal unchanged... */}

      {/* Login Activity Modal */}
      {showSessions && (
        <div className="login-history-modal-backdrop">
          <motion.div
            className="login-history-modal"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.21 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 19 }}>
                Login Activity
              </span>
              <button
                className="close-btn"
                onClick={() => setShowSessions(false)}
              >
                <X size={21} />
              </button>
            </div>
            <div style={{ margin: "18px 0 0 0" }}>
              {user.loginHistory && user.loginHistory.length ? (
                user.loginHistory
                  .slice()
                  .reverse()
                  .map((s, i) => (
                    <div key={i} className="login-device-card">
                      <div
                        style={{
                          display: "flex",
                          gap: "9px",
                          alignItems: "center",
                          fontSize: 15,
                          marginBottom: 2,
                        }}
                      >
                        <span style={{ color: "#7c3aed", fontWeight: 600 }}>
                          {s.hostname || "Unknown device"}
                        </span>
                        <span style={{ color: "#3b3569", opacity: 0.74 }}>
                          {s.platform}
                        </span>
                      </div>
                      <div className="login-device-detail">
                        <span>
                          IP: <b>{s.ip}</b>
                        </span>
                        <span>
                          {Array.isArray(s.networkInterfaces) &&
                          s.networkInterfaces.length ? (
                            <>
                              NI: <b>{s.networkInterfaces.join(", ")}</b>
                            </>
                          ) : null}
                        </span>
                      </div>
                      <div className="login-device-detail">
                        <span>
                          Login:{" "}
                          {s.loginTime
                            ? new Date(s.loginTime).toLocaleString()
                            : "?"}
                        </span>
                        <span>
                          Logout:{" "}
                          {s.logoutTime ? (
                            new Date(s.logoutTime).toLocaleString()
                          ) : (
                            <span style={{ color: "#10b981" }}>Active</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <div style={{ padding: 24, textAlign: "center" }}>
                  No login activity found.
                </div>
              )}
            </div>
          </motion.div>
          <div className="login-history-modal-bg"></div>
        </div>
      )}

      {/* CSS */}
      <style>{`
        .profile-page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fb, #ebf1fe 80%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: "Poppins", sans-serif;
          position: relative;
        }

        .profile-bg {
          position: absolute;
          z-index: 0;
          inset: 0;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.18;
          animation: float 16s ease-in-out infinite;
        }
        .orb-1 { width: 360px; height: 320px; background: #dbeafe; top: -60px; left: -120px;}
        .orb-2 { width: 300px; height: 240px; background: #fee2e2; bottom: -120px; right: -110px; animation-delay: -7s;}
        .orb-3 { width: 340px; height: 300px; background: #ede9fe; top: 45%; right: -100px; animation-delay: -3s;}
        @keyframes float {
          0%, 100% { transform: translate(0, 0);}
          50% { transform: translate(28px, -36px);}
        }
        .profile-card {
          z-index: 2;
          max-width: 520px;
          width: 100%;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(18px);
          border-radius: 24px;
          padding: 44px 44px 38px 44px;
          box-shadow: 0 12px 44px rgba(120, 80, 200, 0.10);
          border: 1.5px solid #f3f4f8;
          position: relative;
        }
        .profile-header {
          text-align: center;
          margin-bottom: 36px;
          position: relative;
        }
        .profile-avatar {
          width: 96px; height: 96px; margin: 0 auto 14px;
          border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #f472b6 80%);
          color: white; font-size: 40px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 7px 24px rgba(124,58,237,0.14);
        }
        .profile-title { font-size: 28px; font-weight: 800; color: #1e2532;}
        .profile-subtitle { font-size: 15px; color: #757783;}
        .info-section { display: flex; flex-direction: column; gap: 18px;}
        .info-item {
          background: #f8fafc; border-radius: 13px;
          padding: 18px; margin-bottom: 3px; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.04);
          border: 1px solid #e5e7eb;
        }
        .info-label {
          display: flex; align-items: center; gap: 7px;
          color: #6b7280; font-size: 13px; font-weight: 600;
        }
        .info-value { color: #1e2333; font-size: 16px; font-weight: 600;}
        .button-group { display: flex; gap: 12px; margin-top: 8px;}
        .btn-primary,
        .btn-secondary,
        .btn-cancel {
          flex: 1;
          padding: 13px 20px;
          border-radius: 11px;
          font-weight: 700;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: box-shadow 0.15s, transform 0.13s;
        }
        .btn-primary {
          background: linear-gradient(135deg, #8b5cf6 30%, #db2777 100%);
          color: white;
          box-shadow: 0 4px 16px #e0e0fc36;
        }
        .btn-primary:hover {
          box-shadow: 0 7px 22px #c4b5fd62;
          transform: translateY(-2px);
        }
        .btn-secondary {
          background: linear-gradient(135deg, #fcd34d, #fca5a5 100%);
          color: #22223b;
          box-shadow: 0 4px 14px #fde68ab4;
        }
        .btn-secondary:hover {
          box-shadow: 0 8px 18px #fde68aa8;
          transform: translateY(-2px);
        }
        .btn-cancel {
          background: #f3f4f6; color: #22223b;
          border: 1px solid #e6e6ef;
        }
        .btn-cancel:hover {
          background: #e0e7ef;
        }
        .message {
          border-radius: 9px;
          padding: 12px;
          font-size: 14.5px;
          text-align: center;
          font-weight: 600;
          margin-top: 7px;
        }
        .message-success { background: #ecfdf5; color: #22c55e;}
        .message-error { background: #fef2f2; color: #e11d48; }

        /* OTP Modal */
        .otp-modal-backdrop {
          position: fixed;
          z-index: 99;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .otp-modal {
          position: relative;
          z-index: 100;
          padding: 34px 30px 18px 30px;
          min-width: 320px;
          width: 340px;
          max-width: 98vw;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 38px #d1c4e9, 0 1.5px 6px #eee;
          border: 1.5px solid #ede9fe;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .otp-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 90;
          background: rgba(40, 25, 60, 0.14);
          backdrop-filter: blur(2.6px);
        }
        @media (max-width: 699px) {
          .profile-card {
            padding: 28px 9px 26px 9px;
          }
          .otp-modal {
            padding: 17px 8vw 10px 8vw;
          }
        }

        /* SETTINGS BUTTON */
        .settings-btn {
          background: none;
          border: none;
          position: absolute;
          right: 22px;
          top: 19px;
          color: #6c46f8;
          cursor: pointer;
          padding: 7px;
          border-radius: 7px;
          transition: background 0.14s;
        }
        .settings-btn:hover {
          background: #ede9fe;
        }

        /* LOGIN ACTIVITY MODAL */
        .login-history-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1022;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-history-modal {
          z-index: 1023;
          width: 370px;
          max-width: 98vw;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 32px #c1b6fa46;
          border: 1.2px solid #ede9fe;
          padding: 28px 21px 19px 21px;
          min-height: 118px;
          position: relative;
        }
        .login-history-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 1020;
          background: rgba(36, 19, 54, 0.18);
        }
        .close-btn {
          background: none;
          border: none;
          color: #b4a9f5;
          font-weight: 600;
          font-size: 22px;
          border-radius: 5px;
          cursor: pointer;
          padding: 3px;
        }
        .login-device-card {
          background: #f6f6fa;
          margin-bottom: 13px;
          border-radius: 12px;
          padding: 14px 11px;
          border: 1.2px solid #ede9fe;
          box-shadow: 0 2px 8px #8f81fc11;
        }
        .login-device-detail {
          display: flex;
          justify-content: space-between;
          color: #696386;
          font-size: 13.2px;
          margin-top: 3px;
          flex-wrap: wrap;
          gap: 7px;
        }
        .input-group {
  position: relative;
  margin-bottom: 16px;
}

.input-group input {
  width: 100%;
  padding: 14px 42px 14px 38px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  font-size: 14px;
  outline: none;
  background: #f9fafb;
  transition: all 0.2s ease;
}

.input-group input:focus {
  border-color: #7c3aed;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.input-group label {
  position: absolute;
  top: 50%;
  left: 38px;
  transform: translateY(-50%);
  font-size: 13px;
  color: #6b7280;
  transition: 0.2s ease;
  pointer-events: none;
}

/* Floating label */
.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label {
  top: -7px;
  left: 30px;
  font-size: 11px;
  background: #fff;
  padding: 0 4px;
  color: #7c3aed;
}

/* Left icon */
.input-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #9ca3af;
}

/* Eye icon */
.eye-icon {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #9ca3af;
}
.eye-icon:hover {
  color: #7c3aed;
}
      `}</style>
    </div>
  );
};

export default ProfilePage;
