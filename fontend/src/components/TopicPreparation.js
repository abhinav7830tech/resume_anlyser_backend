"use client";

import { useState } from "react";
import { BookOpen, Code, Database, Globe, Lock, ArrowRight, X, CheckCircle, Play } from "lucide-react";

const topics = [
  {
    category: "Data Structures & Algorithms",
    icon: Code,
    items: ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Dynamic Programming"],
    color: "#8b5cf6",
    content: {
      description: "Master essential data structures and algorithms for coding interviews.",
      resources: [
        { title: "Arrays & Strings - Complete Guide", type: "Video", duration: "45 min" },
        { title: "Linked Lists Deep Dive", type: "Article", duration: "20 min" },
        { title: "Trees & Graphs Fundamentals", type: "Video", duration: "60 min" },
        { title: "Dynamic Programming Patterns", type: "Article", duration: "30 min" },
      ]
    }
  },
  {
    category: "System Design",
    icon: Database,
    items: ["Scalability", "Load Balancing", "Caching", "Database Design"],
    color: "#06b6d4",
    content: {
      description: "Learn how to design scalable systems used by top tech companies.",
      resources: [
        { title: "System Design Basics", type: "Video", duration: "50 min" },
        { title: "Load Balancing Strategies", type: "Article", duration: "25 min" },
        { title: "Caching Patterns", type: "Video", duration: "35 min" },
        { title: "Database Design Principles", type: "Article", duration: "40 min" },
      ]
    }
  },
  {
    category: "Web Development",
    icon: Globe,
    items: ["HTML/CSS/JS", "React/Next.js", "REST APIs", "Authentication"],
    color: "#10b981",
    content: {
      description: "Build modern web applications with popular frameworks.",
      resources: [
        { title: "Modern JavaScript Features", type: "Video", duration: "40 min" },
        { title: "React Hooks Deep Dive", type: "Article", duration: "30 min" },
        { title: "Building REST APIs", type: "Video", duration: "55 min" },
        { title: "Authentication Best Practices", type: "Article", duration: "25 min" },
      ]
    }
  },
  {
    category: "Security",
    icon: Lock,
    items: ["OWASP Top 10", "Encryption", "JWT", "OAuth"],
    color: "#f59e0b",
    content: {
      description: "Understand web security fundamentals and best practices.",
      resources: [
        { title: "OWASP Top 10 Explained", type: "Video", duration: "45 min" },
        { title: "Encryption Fundamentals", type: "Article", duration: "30 min" },
        { title: "JWT Implementation", type: "Video", duration: "35 min" },
        { title: "OAuth 2.0 Guide", type: "Article", duration: "25 min" },
      ]
    }
  },
];

export default function TopicPreparation() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: "white" }}>
          Topic-wise Preparation
        </h2>
        <p style={{ color: "#64748b", fontSize: 16 }}>
          Master interview topics with curated resources
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {topics.map((topic, i) => {
          const Icon = topic.icon;
          return (
            <div
              key={i}
              style={{
                background: "rgba(30, 41, 59, 0.5)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = topic.color;
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: `${topic.color}20`,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Icon size={24} color={topic.color} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: "white" }}>
                {topic.category}
              </h3>
              <ul style={{ fontSize: 14, color: "#94a3b8", paddingLeft: 20, marginBottom: 16 }}>
                {topic.items.map((item, j) => (
                  <li key={j} style={{ marginBottom: 6 }}>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedTopic(topic)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: `${topic.color}20`,
                  color: topic.color,
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                Start Learning <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Learning Modal */}
      {selectedTopic && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          padding: 20,
        }} onClick={() => setSelectedTopic(null)}>
          <div style={{
            background: "#1e293b",
            borderRadius: 20,
            padding: 32,
            maxWidth: 600,
            width: "100%",
            maxHeight: "80vh",
            overflow: "auto",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: `${selectedTopic.color}20`,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <selectedTopic.icon size={24} color={selectedTopic.color} />
                </div>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: "white" }}>{selectedTopic.category}</h3>
                  <p style={{ fontSize: 14, color: "#64748b" }}>{selectedTopic.content.resources.length} Resources</p>
                </div>
              </div>
              <button onClick={() => setSelectedTopic(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>

            <p style={{ fontSize: 15, color: "#94a3b8", marginBottom: 24, lineHeight: 1.6 }}>
              {selectedTopic.content.description}
            </p>

            <h4 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 16 }}>Learning Resources</h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {selectedTopic.content.resources.map((resource, i) => (
                <div key={i} style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      background: selectedTopic.color,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Play size={18} color="white" />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{resource.title}</p>
                      <p style={{ fontSize: 12, color: "#64748b" }}>{resource.type} • {resource.duration}</p>
                    </div>
                  </div>
                  <button style={{
                    padding: "8px 16px",
                    background: selectedTopic.color,
                    border: "none",
                    borderRadius: 8,
                    color: "white",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}>
                    Start
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
