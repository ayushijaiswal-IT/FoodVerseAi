import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ConfigModal from "./components/ConfigModal";
import TabNutrition from "./components/TabNutrition";
import TabFreshness from "./components/TabFreshness";
import TabHygiene from "./components/TabHygiene";
import TabRecipes from "./components/TabRecipes";
import TabMealPlanner from "./components/TabMealPlanner";
import TabAuditHistory from "./components/TabAuditHistory";
import { checkHealth } from "./api";

export default function App() {
  const [activeTab, setActiveTab] = useState("nutrition");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);

  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem("foodverse_ai_config");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      geminiKey: "",
      groqKey: "",
      provider: "gemini",
      demoMode: true
    };
  });

  useEffect(() => {
    checkHealth().then(setBackendStatus);
    const interval = setInterval(() => {
      checkHealth().then(setBackendStatus);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveConfig = (newCfg) => {
    setConfig(newCfg);
    localStorage.setItem("foodverse_ai_config", JSON.stringify(newCfg));
  };

  return (
    <div className="min-h-screen bg-[#080d0f] text-slate-100 flex flex-col font-sans">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500 blur-3xl animate-subtle-glow" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-teal-500 blur-3xl animate-subtle-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-blue-500 blur-3xl animate-subtle-glow" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsConfigOpen(true)}
        backendStatus={backendStatus}
      />

      {/* Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {activeTab === "nutrition" && <TabNutrition config={config} />}
        {activeTab === "freshness" && <TabFreshness config={config} />}
        {activeTab === "hygiene" && <TabHygiene config={config} />}
        {activeTab === "recipes" && <TabRecipes config={config} />}
        {activeTab === "mealplan" && <TabMealPlanner config={config} />}
        {activeTab === "history" && <TabAuditHistory />}
      </main>

      {/* AI Engine & API Configuration Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-200">Food Verse AI</span> • Skill Wallet Capstone Project 3 • Platform ID: <span className="font-mono text-emerald-400">6ac4ca021dcde6d7857c169a</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-500">
            <span>FastAPI Backend</span>
            <span>•</span>
            <span>React.js SPA</span>
            <span>•</span>
            <span>SQLite Database</span>
            <span>•</span>
            <span>Multimodal Vision</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
