import React from "react";
import { 
  UtensilsCrossed, 
  Apple, 
  ShieldCheck, 
  ChefHat, 
  CalendarRange, 
  Activity, 
  Settings, 
  Sparkles,
  Server
} from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, onOpenSettings, backendStatus }) {
  const tabs = [
    { id: "nutrition", label: "Nutrition Audit", icon: UtensilsCrossed, epic: "Epic 2" },
    { id: "freshness", label: "Freshness Diagnostic", icon: Apple, epic: "Epic 3" },
    { id: "hygiene", label: "Kitchen Hygiene", icon: ShieldCheck, epic: "Epic 4" },
    { id: "recipes", label: "Recipe Coach", icon: ChefHat, epic: "Epic 4" },
    { id: "mealplan", label: "TDEE Meal Planner", icon: CalendarRange, epic: "Epic 5" },
    { id: "history", label: "Audits & Analytics", icon: Activity, epic: "Epic 6" }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-emerald-500/20 shadow-2xl">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                  Food Verse AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Capstone P3
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Multimodal Food Intelligence Agent • Platform ID: <span className="font-mono text-emerald-400">6ac4ca021dcde6d7857c169a</span>
              </p>
            </div>
          </div>

          {/* Controls: Connection & Settings */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <span className={`w-2 h-2 rounded-full ${backendStatus?.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden md:inline font-mono">
                {backendStatus?.status === 'healthy' ? 'FastAPI + SQLite Active' : 'Fallback Engine Ready'}
              </span>
            </div>

            <button
              onClick={onOpenSettings}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all"
            >
              <Settings className="w-4 h-4" />
              <span>AI Engine & API Keys</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 scale-[1.02]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded ${isActive ? 'bg-black/20 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                  {tab.epic}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
