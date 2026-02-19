"use client";

import { useRouter } from "next/navigation";
import {
  Home,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
  { id: "resume", label: "Resume Analyzer", icon: FileText },
  { id: "interview", label: "AI Interview", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: "280px",
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(139, 92, 246, 0.2)",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        onClick={() => router.push("/")}
        style={{ cursor: "pointer", marginBottom: 32, padding: "0 8px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "white",
              }}
            >
              ResumeAI
            </h1>
            <p style={{ fontSize: 11, color: "#64748b" }}>Smart Interview</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          const handleClick = () => {
            if (item.path) {
              router.push(item.path);
            } else {
              setActiveTab(item.id);
            }
          };

          return (
            <button
              key={item.id}
              onClick={handleClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                background: isActive
                  ? "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(109, 40, 217, 0.2))"
                  : "transparent",
                color: isActive ? "#a78bfa" : "#94a3b8",
                transition: "all 0.2s",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
                  e.currentTarget.style.color = "#a78bfa";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#94a3b8";
                }
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: 16,
          background: "rgba(139, 92, 246, 0.1)",
          borderRadius: 12,
          marginBottom: 16,
        }}
      >
        <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
          💡 Upload your resume to unlock personalized interview questions
        </p>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
          background: "transparent",
          color: "#94a3b8",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
          e.currentTarget.style.color = "#ef4444";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#94a3b8";
        }}
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}
