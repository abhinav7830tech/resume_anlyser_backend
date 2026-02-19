"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";
import AIInterview from "@/components/AIInterview";
import TopicPreparation from "@/components/TopicPreparation";
import MockAssessment from "@/components/MockAssessment";
import AptitudeTest from "@/components/AptitudeTest";
import Progress from "@/components/Progress";
import Settings from "@/components/Settings";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("resume");
  const [resumeData, setResumeData] = useState(null);

  const handleAnalysisComplete = (data) => {
    setResumeData(data);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "resume":
        return <ResumeAnalyzer onAnalysisComplete={handleAnalysisComplete} />;
      case "interview":
        return <AIInterview resumeData={resumeData} />;
      case "topics":
        return <TopicPreparation />;
      case "mock":
        return <MockAssessment />;
      case "aptitude":
        return <AptitudeTest />;
      case "progress":
        return <Progress />;
      case "settings":
        return <Settings />;
      default:
        return <ResumeAnalyzer onAnalysisComplete={handleAnalysisComplete} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main
        style={{
          marginLeft: "280px",
          flex: 1,
          padding: "32px 40px",
          overflowY: "auto",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: 1200 }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
