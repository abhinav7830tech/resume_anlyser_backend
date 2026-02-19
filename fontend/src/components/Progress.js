"use client";

import { useState } from "react";
import { TrendingUp, Award, Target, Calendar, X, CheckCircle } from "lucide-react";

const stats = [
  { label: "Interviews Completed", value: "12", icon: Award, color: "#8b5cf6" },
  { label: "Average Score", value: "85%", icon: Target, color: "#10b981" },
  { label: "Practice Days", value: "24", icon: Calendar, color: "#f59e0b" },
  { label: "Improvement", value: "+15%", icon: TrendingUp, color: "#ec4899" },
];

const activities = [
  { type: "interview", title: "Software Engineer Interview", score: "8/10", date: "Today" },
  { type: "study", title: "System Design", duration: "45 min", date: "Yesterday" },
  { type: "practice", title: "Arrays & Strings", score: "10/10", date: "2 days ago" },
  { type: "test", title: "Aptitude Test", score: "85%", date: "3 days ago" },
];

const achievements = [
  { title: "First Interview", desc: "Complete your first mock interview", earned: true, icon: "🎯" },
  { title: "Perfect Score", desc: "Score 100% in any assessment", earned: true, icon: "⭐" },
  { title: "Week Warrior", desc: "Practice for 7 days in a row", earned: true, icon: "🔥" },
  { title: "Speed Demon", desc: "Complete a test in under 10 minutes", earned: false, icon: "⚡" },
];

export default function Progress() {
  const [selectedActivity, setSelectedActivity] = useState(null);

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: "white" }}>
          Your Progress
        </h2>
        <p style={{ color: "#64748b", fontSize: 16 }}>
          Track your interview preparation journey
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              style={{
                background: "rgba(30, 41, 59, 0.5)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: `${stat.color}20`,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={20} color={stat.color} />
                </div>
                <div>
                  <p style={{ fontSize: 13, color: "#64748b" }}>{stat.label}</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Activity */}
        <div
          style={{
            background: "rgba(30, 41, 59, 0.5)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "white" }}>
            Recent Activity
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {activities.map((activity, i) => (
              <div
                key={i}
                onClick={() => setSelectedActivity(activity)}
                style={{
                  padding: 16,
                  background: "rgba(139, 92, 246, 0.1)",
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      background: activity.type === "interview" ? "#8b5cf6" : activity.type === "study" ? "#06b6d4" : activity.type === "practice" ? "#10b981" : "#f59e0b",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}>
                      {activity.type === "interview" ? "💬" : activity.type === "study" ? "📚" : activity.type === "practice" ? "💡" : "🧠"}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{activity.title}</p>
                      <p style={{ fontSize: 12, color: "#64748b" }}>{activity.date}</p>
                    </div>
                  </div>
                  <div style={{
                    padding: "4px 10px",
                    background: "rgba(16, 185, 129, 0.2)",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#10b981",
                  }}>
                    {activity.score || activity.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div
          style={{
            background: "rgba(30, 41, 59, 0.5)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "white" }}>
            Achievements
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {achievements.map((achievement, i) => (
              <div
                key={i}
                style={{
                  padding: 16,
                  background: achievement.earned ? "rgba(139, 92, 246, 0.1)" : "rgba(15, 23, 42, 0.6)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: achievement.earned ? 1 : 0.5,
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  background: achievement.earned ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#334155",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}>
                  {achievement.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{achievement.title}</p>
                  <p style={{ fontSize: 12, color: "#64748b" }}>{achievement.desc}</p>
                </div>
                {achievement.earned && <CheckCircle size={20} color="#10b981" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          padding: 20,
        }} onClick={() => setSelectedActivity(null)}>
          <div style={{
            background: "#1e293b",
            borderRadius: 20,
            padding: 32,
            maxWidth: 400,
            width: "100%",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: selectedActivity.type === "interview" ? "#8b5cf6" : selectedActivity.type === "study" ? "#06b6d4" : selectedActivity.type === "practice" ? "#10b981" : "#f59e0b",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                }}>
                  {selectedActivity.type === "interview" ? "💬" : selectedActivity.type === "study" ? "📚" : selectedActivity.type === "practice" ? "💡" : "🧠"}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "white" }}>{selectedActivity.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748b" }}>{selectedActivity.date}</p>
                </div>
              </div>
              <button onClick={() => setSelectedActivity(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: 16, background: "rgba(15, 23, 42, 0.6)", borderRadius: 12, marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 8 }}>Performance</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: "#10b981" }}>{selectedActivity.score || selectedActivity.duration}</p>
            </div>

            <button
              onClick={() => setSelectedActivity(null)}
              style={{
                width: "100%",
                padding: 12,
                background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                border: "none",
                borderRadius: 10,
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              View Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
