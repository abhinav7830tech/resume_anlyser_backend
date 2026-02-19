"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem("user", JSON.stringify(formData));
      router.push("/dashboard");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      padding: "20px"
    }}>
      {/* Background Effects */}
      <div style={{
        position: "fixed",
        top: "20%",
        left: "10%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
        filter: "blur(80px)",
      }} />
      <div style={{
        position: "fixed",
        bottom: "20%",
        right: "10%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)",
        filter: "blur(80px)",
      }} />

      <div style={{
        width: "100%",
        maxWidth: 440,
        background: "rgba(30, 41, 59, 0.8)",
        backdropFilter: "blur(20px)",
        borderRadius: 24,
        padding: 40,
        border: "1px solid rgba(255,255,255,0.1)",
        position: "relative",
        zIndex: 1
      }}>
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            background: "none",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 14
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56,
            height: 56,
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px"
          }}>
            <Sparkles size={28} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            {isLogin ? "Sign in to continue to ResumeAI" : "Start your interview prep journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {!isLogin && (
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                style={inputStyle}
              />
              {errors.name && <span style={errorStyle}>{errors.name}</span>}
            </div>
          )}

          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={inputStyle}
            />
            {errors.email && <span style={errorStyle}>{errors.email}</span>}
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: 48 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer"
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span style={errorStyle}>{errors.password}</span>}
          </div>

          {!isLogin && (
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={inputStyle}
              />
              {errors.confirmPassword && <span style={errorStyle}>{errors.confirmPassword}</span>}
            </div>
          )}

          {isLogin && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" style={{
                background: "none",
                border: "none",
                color: "#8b5cf6",
                fontSize: 14,
                cursor: "pointer"
              }}>
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "white",
              padding: "14px 24px",
              borderRadius: 12,
              border: "none",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              marginTop: 8
            }}
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <span style={{ color: "#64748b", fontSize: 14 }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            style={{
              background: "none",
              border: "none",
              color: "#8b5cf6",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ padding: "0 16px", color: "#64748b", fontSize: 13 }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Social Login */}
        <div style={{ display: "flex", gap: 12 }}>
          <button style={socialButtonStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button style={socialButtonStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 8,
  color: "#e2e8f0"
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "rgba(15, 23, 42, 0.6)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  color: "white",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s"
};

const errorStyle = {
  display: "block",
  fontSize: 12,
  color: "#ef4444",
  marginTop: 6
};

const socialButtonStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "12px 16px",
  background: "rgba(15, 23, 42, 0.6)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  color: "#e2e8f0",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s"
};
