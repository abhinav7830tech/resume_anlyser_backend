"use client";

import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    emailAlerts: false,
  });

  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitQuery = async () => {
    if (!query.trim()) return;

    const userQuery = query;
    setChatHistory((prev) => [...prev, { role: "user", content: userQuery }]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userQuery }),
      });
      const data = await response.json();
      setChatHistory((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting to the server. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ color: "white" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Settings</h1>
      <p style={{ color: "#94a3b8", marginBottom: 32 }}>
        Manage your account and application preferences
      </p>

      <div
        style={{
          background: "rgba(30, 41, 59, 0.5)",
          borderRadius: 16,
          padding: 24,
          border: "1px solid rgba(139, 92, 246, 0.1)",
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
          General Settings
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ fontWeight: 500 }}>Dark Mode</p>
              <p style={{ fontSize: 13, color: "#94a3b8" }}>
                Enable dark theme for the interface
              </p>
            </div>
            <button
              onClick={() => handleChange("darkMode", !settings.darkMode)}
              style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                border: "none",
                background: settings.darkMode ? "#8b5cf6" : "#475569",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: settings.darkMode ? 25 : 3,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "white",
                  transition: "left 0.2s",
                }}
              />
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ fontWeight: 500 }}>Notifications</p>
              <p style={{ fontSize: 13, color: "#94a3b8" }}>
                Receive push notifications
              </p>
            </div>
            <button
              onClick={() =>
                handleChange("notifications", !settings.notifications)
              }
              style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                border: "none",
                background: settings.notifications ? "#8b5cf6" : "#475569",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: settings.notifications ? 25 : 3,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "white",
                  transition: "left 0.2s",
                }}
              />
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ fontWeight: 500 }}>Email Alerts</p>
              <p style={{ fontSize: 13, color: "#94a3b8" }}>
                Get updates via email
              </p>
            </div>
            <button
              onClick={() => handleChange("emailAlerts", !settings.emailAlerts)}
              style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                border: "none",
                background: settings.emailAlerts ? "#8b5cf6" : "#475569",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: settings.emailAlerts ? 25 : 3,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "white",
                  transition: "left 0.2s",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsChatOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)",
          zIndex: 100,
        }}
      >
        <MessageCircle size={24} color="white" />
      </button>

      {isChatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: 380,
            height: 500,
            background: "rgba(15, 23, 42, 0.98)",
            borderRadius: 16,
            border: "1px solid rgba(139, 92, 246, 0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: 16,
              borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontWeight: 600, fontSize: 16 }}>Help & Support</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <X size={20} color="#94a3b8" />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {chatHistory.length === 0 && (
              <div style={{ textAlign: "center", color: "#64748b", marginTop: 40 }}>
                <MessageCircle size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
                <p>Ask any question and get instant help</p>
              </div>
            )}
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                      : "rgba(30, 41, 59, 0.8)",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(30, 41, 59, 0.8)",
                  fontSize: 14,
                }}
              >
                Thinking...
              </div>
            )}
          </div>

          <div
            style={{
              padding: 16,
              borderTop: "1px solid rgba(139, 92, 246, 0.1)",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitQuery()}
              placeholder="Type your query..."
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 10,
                border: "1px solid rgba(139, 92, 246, 0.2)",
                background: "rgba(30, 41, 59, 0.5)",
                color: "white",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              onClick={handleSubmitQuery}
              disabled={isLoading || !query.trim()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: query.trim() ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#475569",
                border: "none",
                cursor: query.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Send size={18} color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
