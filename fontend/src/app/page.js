"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  MessageSquare, 
  Brain, 
  CheckCircle, 
  ArrowRight, 
  Play,
  X,
  Sparkles,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume Analysis",
    description: "Upload your resume and get instant AI-powered feedback on skills, formatting, and ATS compatibility.",
    color: "#8b5cf6"
  },
  {
    icon: MessageSquare,
    title: "AI Interview Practice",
    description: "Practice mock interviews with our AI interviewer. Get real-time feedback and improve your answers.",
    color: "#06b6d4"
  },
  {
    icon: Brain,
    title: "Smart Assistance",
    description: "Get instant help with any query. Our AI support is available 24/7 to assist you.",
    color: "#10b981"
  }
];

const stats = [
  { value: "Trusted", label: "by Job Seekers" },
  { value: "AI-Powered", label: "Interview Prep" },
  { value: "Real-time", label: "Feedback" },
  { value: "24/7", label: "Support" }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    text: "ResumeAI helped me land my dream job! The AI interview practice was incredibly helpful.",
    avatar: "SC"
  },
  {
    name: "Michael Park",
    role: "Product Manager at Meta",
    text: "The resume analysis gave me actionable insights that improved my application significantly.",
    avatar: "MP"
  },
  {
    name: "Emily Johnson",
    role: "Data Scientist at Netflix",
    text: "The AI support helped me with all my queries instantly. Best interview prep tool!",
    avatar: "EJ"
  }
];

export default function Home() {
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "white" }}>
      {/* Navbar */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => router.push("/")}>
            <div style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Sparkles size={20} color="white" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 700 }}>ResumeAI</span>
          </div>

          {/* Desktop Nav Links */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} style={navLinkStyle}>Features</button>
            <button onClick={() => document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" })} style={navLinkStyle}>Testimonials</button>
            <button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} style={navLinkStyle}>Pricing</button>
          </div>

          {/* Desktop Buttons */}
          <div className="desktop-buttons" style={{ display: "flex", gap: 12 }}>
            <button onClick={() => router.push("/auth")} style={btnSecondary}>Sign In</button>
            <button onClick={() => router.push("/auth")} style={btnPrimary}>Get Started</button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
            }}
          >
            <div style={{ width: 24, height: 2, background: "white", marginBottom: 6 }}></div>
            <div style={{ width: 24, height: 2, background: "white", marginBottom: 6 }}></div>
            <div style={{ width: 24, height: 2, background: "white" }}></div>
          </button>
        </div>

          {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            background: "rgba(15, 23, 42, 0.98)",
            padding: "16px 24px",
            borderTop: "1px solid rgba(139, 92, 246, 0.2)",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button onClick={() => { document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }} style={mobileNavLink}>Features</button>
              <button onClick={() => { document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }} style={mobileNavLink}>Testimonials</button>
              <button onClick={() => { document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }} style={mobileNavLink}>Pricing</button>
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <button onClick={() => { router.push("/auth"); setMobileMenuOpen(false); }} style={{...btnSecondary, flex: 1}}>Sign In</button>
                <button onClick={() => { router.push("/auth"); setMobileMenuOpen(false); }} style={{...btnPrimary, flex: 1}}>Get Started</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 40px 80px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background Effects */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />

        <div style={{ maxWidth: 900, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "rgba(139, 92, 246, 0.15)",
            borderRadius: "50px",
            marginBottom: 24,
            border: "1px solid rgba(139, 92, 246, 0.3)"
          }}>
            <Zap size={14} color="#8b5cf6" />
            <span style={{ fontSize: 14, color: "#a78bfa" }}>AI-Powered Interview Prep</span>
          </div>

          <h1 style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 24,
            background: "linear-gradient(135deg, #fff 0%, #a78bfa 50%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Ace Your Next Interview with AI
          </h1>

          <p style={{ fontSize: 20, color: "#94a3b8", marginBottom: 40, lineHeight: 1.7, maxWidth: 600, margin: "0 auto 40px" }}>
            Analyze your resume, practice with an AI interviewer, and get personalized feedback to land your dream job.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/auth")} style={{...btnPrimary, fontSize: 16, padding: "16px 32px"}}>
              Start Free Trial
              <ArrowRight size={18} />
            </button>
            <button onClick={() => setShowDemo(true)} style={{...btnSecondary, fontSize: 16, padding: "16px 32px"}}>
              <Play size={18} />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 60 }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>{stat.value}</div>
                <div style={{ fontSize: 14, color: "#64748b" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "100px 40px", background: "#0f172a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>Everything You Need</h2>
            <p style={{ fontSize: 18, color: "#64748b", maxWidth: 500, margin: "0 auto" }}>
              Comprehensive tools to prepare you for your next big opportunity
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {features.map((feature, i) => (
              <div 
                key={i} 
                onClick={() => router.push("/auth")}
                style={{
                  background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))",
                  borderRadius: 20,
                  padding: 32,
                  border: "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = feature.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: `${feature.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}>
                  <feature.icon size={28} color={feature.color} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>{feature.title}</h3>
                <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.6, marginBottom: 20 }}>{feature.description}</p>
                <button 
                  onClick={() => router.push("/auth")}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 6, 
                    color: feature.color, 
                    background: "none", 
                    border: "none", 
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  Try now <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "100px 40px", background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 60 }}>How It Works</h2>
          
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {[
              { num: "01", title: "Upload Resume", desc: "Upload your PDF resume", icon: FileText },
              { num: "02", title: "Get Analysis", desc: "AI analyzes your strengths", icon: Target },
              { num: "03", title: "Practice", desc: "Mock interview with AI", icon: MessageSquare },
            ].map((step, i) => (
              <div 
                key={i}
                onClick={() => router.push("/auth")}
                style={{
                  flex: "1 1 200px",
                  maxWidth: 240,
                  textAlign: "center",
                  cursor: "pointer",
                  padding: 24,
                  borderRadius: 16,
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: 18,
                  fontWeight: 700
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: "100px 40px", background: "#0f172a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>Loved by Job Seekers</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {testimonials.map((item, i) => (
              <div key={i} style={{
                background: "rgba(30, 41, 59, 0.5)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(255,255,255,0.1)"
              }}>
                <div style={{ display: "flex", gap: 1, marginBottom: 16 }}>
                  {[...Array(5)].map((_, j) => <span key={j} style={{ color: "#fbbf24" }}>★</span>)}
                </div>
                <p style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, marginBottom: 20 }}>"{item.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 600
                  }}>
                    {item.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "100px 40px", background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>Simple Pricing</h2>
          <p style={{ fontSize: 18, color: "#64748b", marginBottom: 48 }}>Choose the plan that works for you</p>

          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {/* Free Plan */}
            <div style={{
              background: "rgba(30, 41, 59, 0.5)",
              borderRadius: 20,
              padding: 32,
              border: "1px solid rgba(255,255,255,0.1)",
              flex: "1 1 280px",
              maxWidth: 320,
            }}>
              <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Free</h3>
              <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 8 }}>$0<span style={{ fontSize: 16, fontWeight: 400, color: "#64748b" }}>/month</span></div>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>Perfect for getting started</p>
              <ul style={{ textAlign: "left", fontSize: 14, color: "#94a3b8", marginBottom: 24, paddingLeft: 20 }}>
                <li style={{ marginBottom: 8 }}>✓ 3 Resume Analyses</li>
                <li style={{ marginBottom: 8 }}>✓ 5 AI Interview Sessions</li>
                <li style={{ marginBottom: 8 }}>✓ AI Support Assistant</li>
                <li style={{ marginBottom: 8 }}>✓ Email Support</li>
              </ul>
              <button onClick={() => router.push("/auth")} style={{
                width: "100%",
                padding: "12px 24px",
                background: "transparent",
                border: "1px solid #8b5cf6",
                borderRadius: 10,
                color: "#8b5cf6",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}>
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div style={{
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(109, 40, 217, 0.2))",
              borderRadius: 20,
              padding: 32,
              border: "2px solid #8b5cf6",
              flex: "1 1 280px",
              maxWidth: 320,
              position: "relative",
            }}>
              <div style={{
                position: "absolute",
                top: -12,
                left: "50%",
                transform: "translateX(-50%)",
                background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                padding: "4px 16px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}>
                MOST POPULAR
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Pro</h3>
              <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 8 }}>$19<span style={{ fontSize: 16, fontWeight: 400, color: "#64748b" }}>/month</span></div>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>For serious job seekers</p>
              <ul style={{ textAlign: "left", fontSize: 14, color: "#94a3b8", marginBottom: 24, paddingLeft: 20 }}>
                <li style={{ marginBottom: 8 }}>✓ Unlimited Resume Analyses</li>
                <li style={{ marginBottom: 8 }}>✓ Unlimited AI Interviews</li>
                <li style={{ marginBottom: 8 }}>✓ AI Support Assistant</li>
                <li style={{ marginBottom: 8 }}>✓ Priority Support</li>
                <li style={{ marginBottom: 8 }}>✓ Custom Interview Questions</li>
              </ul>
              <button onClick={() => router.push("/auth")} style={{
                width: "100%",
                padding: "12px 24px",
                background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                border: "none",
                borderRadius: 10,
                color: "white",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}>
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div style={{
              background: "rgba(30, 41, 59, 0.5)",
              borderRadius: 20,
              padding: 32,
              border: "1px solid rgba(255,255,255,0.1)",
              flex: "1 1 280px",
              maxWidth: 320,
            }}>
              <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Enterprise</h3>
              <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 8 }}>$49<span style={{ fontSize: 16, fontWeight: 400, color: "#64748b" }}>/month</span></div>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>For teams and recruiters</p>
              <ul style={{ textAlign: "left", fontSize: 14, color: "#94a3b8", marginBottom: 24, paddingLeft: 20 }}>
                <li style={{ marginBottom: 8 }}>✓ Everything in Pro</li>
                <li style={{ marginBottom: 8 }}>✓ Team Management</li>
                <li style={{ marginBottom: 8 }}>✓ Candidate Assessment</li>
                <li style={{ marginBottom: 8 }}>✓ API Access</li>
                <li style={{ marginBottom: 8 }}>✓ Dedicated Support</li>
              </ul>
              <button onClick={() => router.push("/auth")} style={{
                width: "100%",
                padding: "12px 24px",
                background: "transparent",
                border: "1px solid #8b5cf6",
                borderRadius: 10,
                color: "#8b5cf6",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "100px 40px", background: "linear-gradient(135deg, #0e7490 0%, #155e75 100%)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>Ready to Land Your Dream Job?</h2>
          <p style={{ fontSize: 18, marginBottom: 32, opacity: 0.9 }}>Join thousands who got hired at top companies with AI-powered prep</p>
          <button onClick={() => router.push("/auth")} style={{
            background: "white",
            color: "#155e75",
            padding: "18px 48px",
            borderRadius: 50,
            border: "none",
            fontSize: 18,
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.3s"
          }}>
            Get Started Free <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px", background: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Sparkles size={16} color="white" />
            </div>
            <span style={{ fontWeight: 600 }}>ResumeAI</span>
          </div>
          <p style={{ fontSize: 14, color: "#64748b" }}>© 2026 ResumeAI. All rights reserved.</p>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemo && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          padding: 20
        }} onClick={() => setShowDemo(false)}>
          <div style={{
            background: "#1e293b",
            borderRadius: 20,
            padding: 32,
            maxWidth: 600,
            width: "100%",
            position: "relative"
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowDemo(false)} style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "none",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer"
            }}>
              <X size={24} />
            </button>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>How ResumeAI Works</h3>
            <div style={{ aspectRatio: "16/9", background: "rgba(139, 92, 246, 0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Play size={48} color="#8b5cf6" />
            </div>
            <button onClick={() => { setShowDemo(false); router.push("/auth"); }} style={{...btnPrimary, width: "100%"}}>
              Try It Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const navLinkStyle = {
  background: "none",
  border: "none",
  color: "#cbd5e1",
  fontSize: 15,
  fontWeight: 500,
  cursor: "pointer",
  transition: "color 0.2s"
};

const btnPrimary = {
  background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
  color: "white",
  padding: "12px 24px",
  borderRadius: 12,
  border: "none",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.2s"
};

const btnSecondary = {
  background: "transparent",
  color: "white",
  padding: "12px 24px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.2)",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s"
};

const mobileNavLink = {
  background: "none",
  border: "none",
  color: "#cbd5e1",
  fontSize: 16,
  fontWeight: 500,
  cursor: "pointer",
  padding: "12px 0",
  textAlign: "left",
};
