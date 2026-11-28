import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api, { setAccessToken } from "../api/axios-instance";

const ImpersonationBanner = () => {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const impEmail = sessionStorage.getItem("impersonationEmail");
    if (impEmail) {
      setIsImpersonating(true);
      setEmail(impEmail);
    }
  }, []);

  const handleExit = async () => {
    try {
      await api.post("/users/admin/impersonate/exit");

      const backupToken = localStorage.getItem("adminBackupToken");
      if (backupToken) {
        setAccessToken(backupToken);
        localStorage.removeItem("adminBackupToken");
      }

      sessionStorage.removeItem("impersonationEmail");

      window.location.href = "/admin";
    } catch (err) {
      console.error("Failed to exit impersonation", err);
      alert("Failed to exit impersonation");
    }
  };

  if (!isImpersonating) return null;

  return (
    <div
      className="bg-danger text-white text-center py-2"
      style={{ position: "relative", zIndex: 9999 }}
    >
      You are impersonating <strong>{email}</strong>.
      <button
        onClick={handleExit}
        className="btn btn-sm btn-light ms-3 fw-bold"
      >
        Exit to Admin
      </button>
    </div>
  );
};

export default ImpersonationBanner;
