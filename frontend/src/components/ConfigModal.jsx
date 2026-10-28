import React, { useState } from "react";
import { KeyRound, ShieldAlert, Cpu, X, CheckCircle, ExternalLink } from "lucide-react";

export default function ConfigModal({ isOpen, onClose, config, onSaveConfig }) {
  const [geminiKey, setGeminiKey] = useState(config.geminiKey || "");
  const [groqKey, setGroqKey] = useState(config.groqKey || "");
  const [provider, setProvider] = useState(config.provider || "gemini");
  const [demoMode, setDemoMode] = useState(config.demoMode ?? true);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveConfig({
      geminiKey: geminiKey.trim(),
      groqKey: groqKey.trim(),
      provider,
      demoMode
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">AI Engine & API Configuration</h3>
            <p className="text-xs text-slate-400">Configure Gemini 1.5/2.0, Groq Vision, or Standalone Fallback</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Vision LLM Engine</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider("gemini")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center space-x-2 transition ${
                  provider === "gemini"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500"
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800"
                }`}
              >
                <span>Google Gemini 1.5</span>
              </button>
              <button
                type="button"
                onClick={() => setProvider("groq")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center space-x-2 transition ${
                  provider === "groq"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500"
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800"
                }`}
              >
                <span>Groq LLaMA Vision</span>
              </button>
            </div>
          </div>

          {/* Gemini API Key */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">Google Gemini API Key</label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Groq API Key */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">Groq Cloud API Key</label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>Get Groq Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Fallback & Demonstration Mode Box */}
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">Standalone Demonstration Mode</span>
              </div>
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400 accent-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When enabled, FoodVerse AI utilizes our internal scientific food science inference & CV heuristic engine if no API keys are provided or during network rate-limits.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5 transition"
            >
              {saved ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Apply Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
