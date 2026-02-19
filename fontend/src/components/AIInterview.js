"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Loader, Mic, MicOff, Volume2, VolumeX, X } from "lucide-react";
import { sendChat } from "@/lib/api";

export default function AIInterview({ resumeData }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("technical");
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const isListeningRef = useRef(false);
  const inputRef = useRef("");

  const categories = [
    { id: "technical", label: "Technical", color: "#8b5cf6", icon: "💻" },
    { id: "behavioral", label: "Behavioral", color: "#06b6d4", icon: "🗣️" },
    { id: "situational", label: "Situational", color: "#10b981", icon: "🎯" },
    { id: "hr", label: "HR", color: "#f59e0b", icon: "👤" },
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInput(transcript);
        inputRef.current = transcript;
        
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        silenceTimerRef.current = setTimeout(() => {
          if (recognitionRef.current && isListeningRef.current && inputRef.current.trim()) {
            recognitionRef.current.stop();
          }
        }, 10000);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        isListeningRef.current = false;
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        if (inputRef.current.trim()) {
          setInput("");
          inputRef.current = "";
          sendMessage(inputRef.current);
        }
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        isListeningRef.current = false;
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        if (event.error === "no-speech") {
          return;
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListeningRef.current) {
      try {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        recognitionRef.current?.stop();
      } catch (e) {
        // Ignore errors when stopping
      }
      setIsListening(false);
      isListeningRef.current = false;
    } else {
      setInput("");
      inputRef.current = "";
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        isListeningRef.current = true;
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        silenceTimerRef.current = setTimeout(() => {
          if (recognitionRef.current && isListeningRef.current) {
            recognitionRef.current.stop();
          }
        }, 10000);
      } catch (e) {
        setIsListening(false);
        isListeningRef.current = false;
      }
    }
  };

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleAIResponse = (responseText) => {
    setMessages((prev) => [...prev, { role: "model", content: responseText }]);
    if (autoSpeak) {
      speakText(responseText);
    }
  };

  const endInterview = () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
      isListeningRef.current = false;
    }
    stopSpeaking();
    setStarted(false);
    setMessages([]);
    setInput("");
    inputRef.current = "";
  };

  async function startInterview() {
    setStarted(true);
    setLoading(true);

    try {
      const res = await sendChat(
        resumeData?.resume_text || "",
        resumeData?.job_role || "Software Engineer",
        [],
        null,
        selectedCategory
      );
      handleAIResponse(res.response);
    } catch (err) {
      const fallbackMsg = "Hello! Let's begin your interview. Tell me about yourself.";
      handleAIResponse(fallbackMsg);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(textToSend = null, category = null) {
    const text = textToSend !== null ? textToSend.trim() : input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);
    if (textToSend !== null) {
      setInput("");
      inputRef.current = "";
    }
    setLoading(true);

    stopSpeaking();

    try {
      const geminiHistory = currentHistory.map((m) => ({
        role: m.role === "model" ? "model" : "user",
        content: m.content,
      }));

      const res = await sendChat(
        resumeData?.resume_text || "",
        resumeData?.job_role || "Software Engineer",
        geminiHistory,
        text,
        category || selectedCategory
      );

      handleAIResponse(res.response);
    } catch (err) {
      console.error("Error:", err);
      handleAIResponse("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!started) {
    return (
      <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            background: "rgba(30, 41, 59, 0.5)",
            borderRadius: 16,
            padding: 40,
            border: "1px solid rgba(255,255,255,0.1)",
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
            <Bot size={40} color="white" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: "white" }}>
            AI Interview Session
          </h2>
          <p style={{ color: "#64748b", marginBottom: 32, lineHeight: 1.6 }}>
            {resumeData
              ? `Ready to interview you for ${resumeData.job_role}. Your resume has been analyzed.`
              : "I'll conduct a mock interview. Upload your resume first for personalized questions."}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: "#94a3b8",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#8b5cf6" }}
              />
              Auto-play AI voice
            </label>
          </div>

          <div
            style={{
              textAlign: "left",
              marginBottom: 24,
              padding: 20,
              background: "rgba(139, 92, 246, 0.1)",
              borderRadius: 12,
            }}
          >
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#a78bfa" }}>
              📝 Select Interview Category:
            </h4>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 20px",
                    background: selectedCategory === cat.id 
                      ? `linear-gradient(135deg, ${cat.color}, ${cat.color}99)` 
                      : "rgba(30, 41, 59, 0.8)",
                    border: selectedCategory === cat.id 
                      ? "none" 
                      : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 25,
                    color: "white",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {resumeData?.questions?.[selectedCategory] && (
            <div
              style={{
                textAlign: "left",
                marginBottom: 24,
                padding: 20,
                background: "rgba(139, 92, 246, 0.1)",
                borderRadius: 12,
              }}
            >
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#a78bfa" }}>
                📝 Sample {categories.find(c => c.id === selectedCategory)?.label} Questions:
              </h4>
              <ul style={{ fontSize: 14, color: "#94a3b8", paddingLeft: 20 }}>
                {resumeData.questions[selectedCategory].slice(0, 3).map((q, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>
                    {q.question}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={startInterview}
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
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px" }}>
      <div
        style={{
          background: "rgba(30, 41, 59, 0.5)",
          borderRadius: 16,
          padding: 24,
          border: "1px solid rgba(255,255,255,0.1)",
          height: "70vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "white" }}>AI Interview</h2>
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
              {resumeData ? `Position: ${resumeData.job_role}` : "Mock Interview"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}>
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                style={{ width: 14, height: 14, accentColor: "#8b5cf6" }}
              />
              Voice
            </label>
            <button
              onClick={endInterview}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                border: "none",
                borderRadius: 25,
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(245, 158, 11, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(245, 158, 11, 0.4)";
              }}
            >
              <X size={16} />
              End Interview
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", marginBottom: 20 }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 16,
                alignItems: "flex-start",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: msg.role === "user" ? "#8b5cf6" : "rgba(139, 92, 246, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {msg.role === "user" ? (
                  <User size={18} color="white" />
                ) : (
                  <Bot size={18} color="#8b5cf6" />
                )}
              </div>
              <div
                style={{
                  maxWidth: "70%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: msg.role === "user" ? "#8b5cf6" : "rgba(139, 92, 246, 0.1)",
                  color: "white",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                <div>{msg.content}</div>
                {msg.role === "model" && (
                  <button
                    onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.content)}
                    style={{
                      marginTop: 8,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: isSpeaking ? "#ef4444" : "#8b5cf6",
                    }}
                  >
                    {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    {isSpeaking ? "Stop" : "Listen"}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(139, 92, 246, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bot size={18} color="#8b5cf6" />
              </div>
              <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(139, 92, 246, 0.1)" }}>
                <Loader className="spinner" size={16} color="#8b5cf6" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={toggleListening}
            disabled={loading}
            style={{
              padding: 12,
              background: isListening ? "#ef4444" : "rgba(139, 92, 246, 0.2)",
              color: isListening ? "white" : "#a78bfa",
              border: "none",
              borderRadius: 10,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title={isListening ? "Stop listening" : "Click to speak"}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); inputRef.current = e.target.value; }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={isListening ? "Listening..." : "Type or speak your answer..."}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: "rgba(15, 23, 42, 0.6)",
              border: isListening ? "2px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              fontSize: 14,
              color: "white",
              outline: "none",
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              padding: "12px 20px",
              background: input.trim() && !loading ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)",
              color: "white",
              border: "none",
              borderRadius: 10,
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
