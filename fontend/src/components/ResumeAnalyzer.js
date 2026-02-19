"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, Loader } from "lucide-react";
import { analyzeResume } from "@/lib/api";

const JOB_ROLES = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "UI/UX Designer",
];

export default function ResumeAnalyzer({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("Software Engineer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  async function handleAnalyze() {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeResume(file, jobRole);
      setResult(data);
      onAnalysisComplete(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: "white" }}>
          Resume Analyzer
        </h2>
        <p style={{ color: "#64748b", fontSize: 16 }}>
          Upload your resume and get AI-powered feedback
        </p>
      </div>

      <div
        style={{
          background: "rgba(30, 41, 59, 0.5)",
          borderRadius: 16,
          padding: 24,
          border: "1px solid rgba(255,255,255,0.1)",
          marginBottom: 24,
        }}
      >
        <div
          onClick={() => !file && inputRef.current?.click()}
          style={{
            border: "2px dashed rgba(139, 92, 246, 0.3)",
            borderRadius: 12,
            padding: 48,
            textAlign: "center",
            cursor: file ? "default" : "pointer",
            transition: "all 0.2s",
            background: file ? "rgba(139, 92, 246, 0.05)" : "transparent",
          }}
          onMouseEnter={(e) => {
            if (!file) e.currentTarget.style.borderColor = "#8b5cf6";
          }}
          onMouseLeave={(e) => {
            if (!file) e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
          }}
        >
          {file ? (
            <div>
              <div
                style={{
                  width: 64,
                  height: 64,
                  margin: "0 auto 16px",
                  background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={32} color="white" />
              </div>
              <p style={{ fontWeight: 600, marginBottom: 8, color: "white" }}>
                {file.name}
              </p>
              <p style={{ fontSize: 14, color: "#64748b" }}>
                {(file.size / 1024).toFixed(1)} KB
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setResult(null);
                }}
                style={{
                  marginTop: 16,
                  padding: "8px 16px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: 8,
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: 13,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <X size={14} /> Remove
              </button>
            </div>
          ) : (
            <div>
              <Upload
                size={48}
                color="#8b5cf6"
                style={{ margin: "0 auto 16px" }}
              />
              <p style={{ fontWeight: 600, marginBottom: 8, color: "white" }}>
                Drop your resume here
              </p>
              <p style={{ fontSize: 14, color: "#64748b" }}>
                or click to browse • PDF only
              </p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 8,
              color: "#e2e8f0",
            }}
          >
            Target Job Role
          </label>
          <select
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              fontSize: 14,
              color: "white",
              outline: "none",
            }}
          >
            {JOB_ROLES.map((role) => (
              <option key={role} value={role} style={{ background: "#1e293b" }}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          style={{
            width: "100%",
            marginTop: 24,
            padding: 14,
            background: !file || loading
              ? "rgba(139, 92, 246, 0.3)"
              : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "white",
            borderRadius: 12,
            border: "none",
            fontSize: 15,
            fontWeight: 600,
            cursor: !file || loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <Loader className="spinner" size={16} /> Analyzing...
            </>
          ) : (
            "Analyze Resume"
          )}
        </button>

        {error && (
          <p style={{ color: "#ef4444", fontSize: 14, marginTop: 16 }}>
            ❌ {error}
          </p>
        )}
      </div>

      {result?.analysis && (
        <div
          style={{
            background: "rgba(30, 41, 59, 0.5)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "white" }}>
            Analysis Results
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 20,
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(109, 40, 217, 0.15))",
              borderRadius: 12,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {result.analysis.ats_score}/10
            </div>
            <div>
              <p style={{ fontWeight: 600, marginBottom: 4, color: "white" }}>ATS Score</p>
              <p style={{ fontSize: 13, color: "#94a3b8" }}>
                {result.analysis.ats_score_reason}
              </p>
            </div>
          </div>

          {result.analysis.skills?.technical && (
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "white" }}>
                Technical Skills
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {result.analysis.skills.technical.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "6px 12px",
                      background: "rgba(139, 92, 246, 0.15)",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#a78bfa",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#10b981" }}>
                ✅ Strengths
              </h4>
              <ul style={{ paddingLeft: 20, fontSize: 14, color: "#94a3b8" }}>
                {result.analysis.strengths?.map((s, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#f59e0b" }}>
                ⚠️ Weaknesses
              </h4>
              <ul style={{ paddingLeft: 20, fontSize: 14, color: "#94a3b8" }}>
                {result.analysis.weaknesses?.map((w, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
