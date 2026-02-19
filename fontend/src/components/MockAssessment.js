"use client";

import { useState } from "react";
import { ClipboardCheck, Clock, Award, X, Play, CheckCircle } from "lucide-react";

const problems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", category: "Arrays" },
  { id: 2, title: "Valid Parentheses", difficulty: "Easy", category: "Stacks" },
  { id: 3, title: "Merge Intervals", difficulty: "Medium", category: "Arrays" },
];

export default function MockAssessment() {
  const [started, setStarted] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [code, setCode] = useState("// Write your solution here\n");
  const [submitted, setSubmitted] = useState(false);

  const handleStart = () => {
    setStarted(true);
    setCurrentProblem(0);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(currentProblem + 1);
      setSubmitted(false);
      setCode("// Write your solution here\n");
    }
  };

  const handleFinish = () => {
    setStarted(false);
    setSubmitted(false);
  };

  if (!started) {
    return (
      <div style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: "white" }}>
            Mock Assessment
          </h2>
          <p style={{ color: "#64748b", fontSize: 16 }}>
            Take timed coding challenges and evaluate your performance
          </p>
        </div>

        <div
          style={{
            background: "rgba(30, 41, 59, 0.5)",
            borderRadius: 16,
            padding: 48,
            border: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              margin: "0 auto 24px",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ClipboardCheck size={40} color="white" />
          </div>

          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "white" }}>
            Online Coding Assessment
          </h3>
          <p style={{ color: "#64748b", marginBottom: 32 }}>
            45 minutes • 3 Problems • Difficulty: Medium
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 32 }}>
            <div>
              <Clock size={24} color="#8b5cf6" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontSize: 14, color: "#94a3b8" }}>Timed</p>
            </div>
            <div>
              <Award size={24} color="#8b5cf6" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontSize: 14, color: "#94a3b8" }}>Score Based</p>
            </div>
          </div>

          <button
            onClick={handleStart}
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "white",
              padding: "14px 32px",
              borderRadius: 12,
              border: "none",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "white" }}>Coding Assessment</h2>
          <p style={{ color: "#64748b", fontSize: 14 }}>Problem {currentProblem + 1} of {problems.length}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8" }}>
            <Clock size={18} />
            <span style={{ fontSize: 16, fontWeight: 600 }}>45:00</span>
          </div>
          <button
            onClick={handleFinish}
            style={{
              padding: "8px 16px",
              background: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 8,
              color: "#ef4444",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Finish
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Problem Statement */}
        <div style={{ background: "rgba(30, 41, 59, 0.5)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ 
              padding: "4px 12px", 
              background: problems[currentProblem].difficulty === "Easy" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
              color: problems[currentProblem].difficulty === "Easy" ? "#10b981" : "#f59e0b",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
            }}>
              {problems[currentProblem].difficulty}
            </span>
            <span style={{ color: "#64748b", fontSize: 12 }}>{problems[currentProblem].category}</span>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 16 }}>{problems[currentProblem].title}</h3>
          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>
            Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
            You may assume that each input would have exactly one solution, and you may not use the same element twice.
          </p>
          
          <div style={{ marginTop: 24 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 12 }}>Example:</h4>
            <div style={{ background: "#0f172a", borderRadius: 8, padding: 12, fontSize: 13, color: "#94a3b8", fontFamily: "monospace" }}>
              <p>Input: nums = [2,7,11,15], target = 9</p>
              <p>Output: [0,1]</p>
              <p>Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</p>
            </div>
          </div>

          {/* Problem Navigation */}
          <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
            {problems.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentProblem(i); setSubmitted(false); setCode("// Write your solution here\n"); }}
                style={{
                  flex: 1,
                  padding: 8,
                  background: i === currentProblem ? "#8b5cf6" : "rgba(15, 23, 42, 0.6)",
                  border: "none",
                  borderRadius: 6,
                  color: "white",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <div style={{ background: "rgba(30, 41, 59, 0.5)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "white" }}>Solution</h4>
            <select style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 12px", color: "white", fontSize: 12 }}>
              <option>JavaScript</option>
              <option>Python</option>
              <option>Java</option>
              <option>C++</option>
            </select>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              flex: 1,
              minHeight: "300px",
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: 16,
              color: "#e2e8f0",
              fontSize: 14,
              fontFamily: "monospace",
              resize: "none",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            {submitted ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#10b981" }}>
                <CheckCircle size={18} />
                <span style={{ fontWeight: 600 }}>Submitted Successfully!</span>
              </div>
            ) : <div />}
            <div style={{ display: "flex", gap: 12 }}>
              {currentProblem < problems.length - 1 ? (
                <button
                  onClick={handleNext}
                  style={{
                    padding: "10px 20px",
                    background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                    border: "none",
                    borderRadius: 8,
                    color: "white",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Next Problem
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  style={{
                    padding: "10px 20px",
                    background: "#10b981",
                    border: "none",
                    borderRadius: 8,
                    color: "white",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Submit All
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={submitted}
                style={{
                  padding: "10px 20px",
                  background: submitted ? "rgba(139, 92, 246, 0.3)" : "#8b5cf6",
                  border: "none",
                  borderRadius: 8,
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: submitted ? "not-allowed" : "pointer",
                }}
              >
                Run Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
