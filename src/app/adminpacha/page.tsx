"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          router.push("/adminpacha/dashboard");
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        router.push("/adminpacha/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      {/* Animated background elements */}
      <div className="bg-animation">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-circle">
            <span className="logo-icon">🧛‍♂️</span>
          </div>
          <h1 className="login-title">
            <span className="title-gradient">ADMIN PORTAL</span>
          </h1>
          <p className="login-subtitle">Welcome back, <span className="username">Zul-Qarnain</span></p>
          <div className="datetime">
            <span className="date-icon">🌙</span>
            2025-06-03 20:21:17 UTC
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📧</span>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="form-input"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🔑</span>
              Password
            </label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="form-input password-input"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={loading}
                className="password-toggle"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚡</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className={`submit-button ${loading || !email || !password ? 'disabled' : ''}`}
          >
            {loading && <div className="spinner"></div>}
            <span className="button-text">
              {loading ? "Signing in..." : "🚀 ENTER ADMIN REALM"}
            </span>
          </button>
        </form>

        <div className="footer-info">
          <p className="security-text">
            <span className="security-icon">🛡️</span>
            Protected by Dracula's Magic & Supabase
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #282a36 0%, #44475a 50%, #6272a4 100%);
          font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
          padding: 1rem;
          position: relative;
          overflow: hidden;
        }

        .bg-animation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .floating-circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .circle-1 {
          width: 80px;
          height: 80px;
          background: #ff79c6;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 120px;
          height: 120px;
          background: #8be9fd;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .circle-3 {
          width: 60px;
          height: 60px;
          background: #50fa7b;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        .circle-4 {
          width: 100px;
          height: 100px;
          background: #ffb86c;
          top: 10%;
          right: 30%;
          animation-delay: 1s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .login-card {
          background: linear-gradient(145deg, #282a36 0%, #1e1f29 100%);
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(68, 71, 90, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          width: 100%;
          max-width: 450px;
          border: 2px solid #44475a;
          position: relative;
          backdrop-filter: blur(10px);
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ff79c6, #bd93f9, #8be9fd, #50fa7b);
          border-radius: 22px;
          z-index: -1;
          opacity: 0.3;
          animation: glow 3s ease-in-out infinite alternate;
        }

        @keyframes glow {
          0% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .logo-circle {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #ff79c6 0%, #bd93f9 100%);
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 10px 30px rgba(255, 121, 198, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .logo-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .login-title {
          margin: 0;
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          letter-spacing: 2px;
        }

        .title-gradient {
          background: linear-gradient(135deg, #ff79c6 0%, #bd93f9 50%, #8be9fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .login-subtitle {
          margin: 0;
          color: #6272a4;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .username {
          color: #50fa7b;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(80, 250, 123, 0.3);
        }

        .datetime {
          color: #8be9fd;
          font-size: 0.9rem;
          background: rgba(139, 233, 253, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          border: 1px solid rgba(139, 233, 253, 0.2);
          display: inline-block;
        }

        .date-icon {
          margin-right: 0.5rem;
        }

        .login-form {
          width: 100%;
        }

        .form-group {
          margin-bottom: 2rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.75rem;
          color: #f8f8f2;
          font-weight: 600;
          font-size: 1rem;
          display: flex;
          align-items: center;
        }

        .label-icon {
          margin-right: 0.5rem;
          font-size: 1.1rem;
        }

        .form-input {
          width: 100%;
          padding: 1.2rem;
          border: 2px solid #44475a;
          border-radius: 12px;
          font-size: 1rem;
          background: rgba(40, 42, 54, 0.8);
          color: #f8f8f2;
          transition: all 0.3s ease;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
        }

        .form-input::placeholder {
          color: #6272a4;
        }

        .form-input:focus {
          border-color: #bd93f9;
          box-shadow: 
            0 0 0 3px rgba(189, 147, 249, 0.2),
            0 0 20px rgba(189, 147, 249, 0.1);
          background: rgba(40, 42, 54, 1);
        }

        .form-input:disabled {
          background: rgba(68, 71, 90, 0.5);
          cursor: not-allowed;
        }

        .password-container {
          position: relative;
        }

        .password-input {
          padding-right: 4rem;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.3rem;
          padding: 0.5rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          background: rgba(189, 147, 249, 0.1);
        }

        .password-toggle:hover {
          background: rgba(189, 147, 249, 0.2);
          transform: translateY(-50%) scale(1.1);
        }

        .password-toggle:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .error-message {
          background: linear-gradient(135deg, rgba(255, 85, 85, 0.2) 0%, rgba(255, 85, 85, 0.1) 100%);
          color: #ff5555;
          padding: 1.2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 85, 85, 0.3);
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .error-icon {
          margin-right: 0.75rem;
          font-size: 1.2rem;
          animation: flash 1s ease-in-out infinite;
        }

        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .submit-button {
          width: 100%;
          padding: 1.2rem;
          background: linear-gradient(135deg, #ff79c6 0%, #bd93f9 50%, #8be9fd 100%);
          color: #282a36;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            0 6px 20px rgba(255, 121, 198, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: inherit;
        }

        .submit-button:hover:not(.disabled) {
          transform: translateY(-3px);
          box-shadow: 
            0 10px 30px rgba(255, 121, 198, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          background: linear-gradient(135deg, #ff79c6 20%, #bd93f9 60%, #8be9fd 100%);
        }

        .submit-button.disabled {
          background: linear-gradient(135deg, #44475a 0%, #6272a4 100%);
          color: #6272a4;
          cursor: not-allowed;
          box-shadow: none;
        }

        .button-text {
          display: flex;
          align-items: center;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid transparent;
          border-top: 3px solid #282a36;
          border-radius: 50%;
          margin-right: 1rem;
          animation: spin 1s linear infinite;
        }

        .footer-info {
          text-align: center;
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(68, 71, 90, 0.3);
          border-radius: 12px;
          border: 1px solid rgba(98, 114, 164, 0.3);
        }

        .security-text {
          margin: 0;
          color: #6272a4;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .security-icon {
          margin-right: 0.5rem;
          animation: rotate 4s linear infinite;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive design */
        @media (max-width: 480px) {
          .login-card {
            padding: 2rem;
            margin: 1rem;
          }
          
          .login-title {
            font-size: 1.8rem;
          }
          
          .logo-circle {
            width: 80px;
            height: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;