import React, { useState } from "react";
import { 
  ShieldCheck, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileCheck, 
  Loader2, 
  ChefHat, 
  Sparkles,
  Layers,
  Image as ImageIcon 
} from "lucide-react";
import { auditHygieneApi } from "../api";

export default function TabHygiene({ config }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleKitchens = [
    { label: "Hot Line & Prep Counter", path: "/samples/commercial_kitchen.jpg", notes: "Station inspection with raw poultry and salad cutting boards" },
    { label: "Butchery & Sinks Area", path: "/samples/mediterranean_salad.jpg", notes: "Handwashing and utensil sanitization inspection" }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleSelectSample = async (sample) => {
    try {
      setPreviewUrl(sample.path);
      setNotes(sample.notes);
      setResult(null);
      setError(null);
      
      const res = await fetch(sample.path);
      const blob = await res.blob();
      const file = new File([blob], sample.path.split("/").pop(), { type: "image/jpeg" });
      setSelectedFile(file);
    } catch (err) {
      setError("Failed to load sample: " + err.message);
    }
  };

  const handleAudit = async () => {
    if (!selectedFile) {
      setError("Please select or upload a commercial kitchen image or video frame first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await auditHygieneApi(
        selectedFile,
        notes,
        config.geminiKey || config.groqKey,
        config.provider
      );
      setResult(data);
    } catch (err) {
      setError(err.message || "Audit error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/30 via-slate-900/60 to-indigo-950/20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Epic 4: Commercial Kitchen Hygiene & Food Safety Compliance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Kitchen Hygiene & Food Safety Compliance Monitor
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Upload commercial kitchen photos or surveillance video frames to audit hairnet/chef hat compliance, nitrile glove protocols, stainless steel sanitation, and cross-contamination hazards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
              <Upload className="w-4 h-4 text-blue-400" />
              <span>Kitchen Surveillance Feed / Photo</span>
            </h3>

            {/* Drop Zone */}
            <div className="relative border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-900/40">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {previewUrl ? (
                <div className="space-y-2">
                  <img
                    src={previewUrl}
                    alt="Kitchen Workstation"
                    className="w-full h-48 object-cover rounded-lg shadow-md mx-auto"
                  />
                  <p className="text-xs text-blue-400 font-medium">Click or drag to change feed</p>
                </div>
              ) : (
                <div className="py-6 space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-slate-300">Upload kitchen photo or video frame</p>
                  <p className="text-[11px] text-slate-500">Cook lines, prep tables, wash stations, walk-in coolers</p>
                </div>
              )}
            </div>

            {/* Sample Selector */}
            <div className="mt-4">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Or Try Sample Inspection Feed:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sampleKitchens.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(s)}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-blue-950/40 border border-slate-700 hover:border-blue-500/40 text-[11px] text-slate-300 hover:text-blue-300 transition text-center line-clamp-1"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Station Notes / Shift Context (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Lunch rush prep, station #3, HACCP audit..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Audit Button */}
            <button
              onClick={handleAudit}
              disabled={loading}
              className="mt-5 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditing Compliance & Hazards...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Execute HACCP Hygiene Audit</span>
                </>
              )}
            </button>

            {error && (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Inspection Report (7 cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 space-y-6 animate-in fade-in duration-300">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    {result.kitchen_zone}
                  </div>
                  <h3 className="text-2xl font-black text-white mt-1 font-display">
                    Commercial Inspection Report
                  </h3>
                </div>

                {/* Score & Grade */}
                <div className="flex items-center space-x-3 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-700">
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">{result.compliance_grade}</div>
                    <div className="text-[10px] text-slate-400">Score: {result.overall_compliance_score}%</div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    result.overall_compliance_score >= 85
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {result.overall_compliance_score >= 85 ? 'PASSED' : 'ACTION REQUIRED'}
                  </div>
                </div>
              </div>

              {/* Compliance Indicators Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center space-x-1.5">
                    <ChefHat className="w-3.5 h-3.5 text-blue-400" />
                    <span>Hairnet / Hat</span>
                  </div>
                  <div className="text-xs font-medium text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="line-clamp-2">{result.chef_hat_hairnet_status}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Nitrile Gloves</span>
                  </div>
                  <div className="text-xs font-medium text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="line-clamp-2">{result.glove_usage_status}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Sanitization</span>
                  </div>
                  <div className="text-xs font-medium text-slate-200 flex items-center space-x-1">
                    <span className="line-clamp-2">{result.sanitization_state}</span>
                  </div>
                </div>
              </div>

              {/* Cross Contamination Hazard Alert */}
              {result.cross_contamination_alert && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-300">Cross-Contamination Alert Detected</div>
                    <div className="mt-0.5 leading-relaxed">{result.cross_contamination_alert}</div>
                  </div>
                </div>
              )}

              {/* Itemized Violation Logs */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>Itemized Non-Compliance & Hazard Logs ({result.itemized_violations?.length || 0})</span>
                </h4>

                <div className="space-y-2">
                  {(result.itemized_violations || []).map((vio, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-blue-400">{vio.id}</span>
                          <span className="font-semibold text-slate-200">{vio.hazard_type}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          vio.severity === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {vio.severity}
                        </span>
                      </div>
                      <p className="text-slate-300">{vio.description}</p>
                      <div className="pt-1 text-[11px] text-emerald-400 font-medium">
                        Correction: {vio.remediation_action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* HACCP Summary */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs leading-relaxed space-y-1.5">
                <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                  <FileCheck className="w-4 h-4 text-blue-400" />
                  <span>Regulatory Compliance Officer Summary</span>
                </div>
                <p className="text-slate-300">{result.haccp_summary}</p>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 rounded-2xl border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">Ready for Kitchen Hygiene Audit</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Upload an image or video frame of your kitchen to evaluate hairnets, gloves, cross-contamination, and sanitation scores.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
