import React, { useState } from "react";
import { 
  Apple, 
  Upload, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Archive, 
  Loader2, 
  Microscope,
  Image as ImageIcon 
} from "lucide-react";
import { diagnoseFreshnessApi } from "../api";

export default function TabFreshness({ config }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [foodHint, setFoodHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleItems = [
    { label: "Fresh Strawberries", path: "/samples/fresh_strawberries.jpg", hint: "Organic Garden Strawberries" },
    { label: "Spoiled Avocado (Mold/Browning)", path: "/samples/spoiled_avocado.jpg", hint: "Hass Avocado showing browning & mold spots" },
    { label: "Poultry / Raw Chicken", path: "/samples/mediterranean_salad.jpg", hint: "Free-range chicken breast cutlet" }
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
      setFoodHint(sample.hint);
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

  const handleDiagnose = async () => {
    if (!selectedFile) {
      setError("Please select or upload a perishable food image first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await diagnoseFreshnessApi(
        selectedFile,
        foodHint,
        config.geminiKey || config.groqKey,
        config.provider
      );
      setResult(data);
    } catch (err) {
      setError(err.message || "Diagnostic error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (stage) => {
    if (stage === "Fresh") {
      return {
        bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        icon: CheckCircle2,
        color: "text-emerald-400"
      };
    } else if (stage === "Moderately Fresh") {
      return {
        bg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        icon: AlertTriangle,
        color: "text-amber-400"
      };
    } else {
      return {
        bg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
        icon: XCircle,
        color: "text-rose-400"
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-teal-500/20 bg-gradient-to-r from-teal-950/30 via-slate-900/60 to-emerald-950/20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-3">
            <Apple className="w-3.5 h-3.5" />
            <span>Epic 3: Freshness & Spoilage Diagnostic Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Food Freshness & Spoilage Diagnostic
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Inspect raw perishables (fruits, vegetables, meats, dairy) via computer vision to detect surface discoloration, wrinkling, tissue breakdown, and mycelium/mold spores.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
              <Upload className="w-4 h-4 text-teal-400" />
              <span>Perishable Item Capture</span>
            </h3>

            {/* Drop Zone */}
            <div className="relative border-2 border-dashed border-slate-700 hover:border-teal-500/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-900/40">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {previewUrl ? (
                <div className="space-y-2">
                  <img
                    src={previewUrl}
                    alt="Perishable Target"
                    className="w-full h-48 object-cover rounded-lg shadow-md mx-auto"
                  />
                  <p className="text-xs text-teal-400 font-medium">Click or drag to change image</p>
                </div>
              ) : (
                <div className="py-6 space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-slate-300">Upload raw perishable food photo</p>
                  <p className="text-[11px] text-slate-500">Fruits, greens, cuts of meat, dairy packaging</p>
                </div>
              )}
            </div>

            {/* Preset Sample Perishables */}
            <div className="mt-4">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Or Try Sample Test Perishables:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sampleItems.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(s)}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-teal-950/40 border border-slate-700 hover:border-teal-500/40 text-[11px] text-slate-300 hover:text-teal-300 transition text-center line-clamp-1"
                  >
                    {s.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Item Hint Input */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Item Name / Food Type Hint (Optional)
              </label>
              <input
                type="text"
                value={foodHint}
                onChange={(e) => setFoodHint(e.target.value)}
                placeholder="e.g. Avocado, Chicken Breast, Strawberries, Spinach..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Diagnose Button */}
            <button
              onClick={handleDiagnose}
              disabled={loading}
              className="mt-5 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Biomarkers & Degradation...</span>
                </>
              ) : (
                <>
                  <Microscope className="w-4 h-4" />
                  <span>Diagnose Spoilage & Freshness</span>
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

        {/* Right: Diagnostic Results (7 cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="glass-panel p-6 rounded-2xl border border-teal-500/20 space-y-6 animate-in fade-in duration-300">
              {/* Header Status Card */}
              {(() => {
                const badge = getStatusBadge(result.freshness_stage);
                const IconComponent = badge.icon;
                return (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {result.food_category}
                      </div>
                      <h3 className="text-2xl font-black text-white mt-1 font-display">
                        {result.item_detected}
                      </h3>
                    </div>

                    {/* Freshness Classification Pill */}
                    <div className={`px-4 py-2 rounded-2xl border flex items-center space-x-2.5 ${badge.bg}`}>
                      <IconComponent className={`w-5 h-5 ${badge.color}`} />
                      <div>
                        <div className="text-xs font-bold leading-tight">{result.freshness_stage}</div>
                        <div className="text-[10px] opacity-80">Index: {result.freshness_index_percent}%</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Action Directive & Remaining Shelf Life */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    <span>Food Safety Directive</span>
                  </div>
                  <div className="text-base font-extrabold text-white">
                    {result.safety_action}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span>Estimated Remaining Shelf-Life</span>
                  </div>
                  <div className="text-base font-extrabold text-white">
                    {result.shelf_life_remaining_days} Days{" "}
                    <span className="text-xs font-normal text-slate-400">
                      (at recommended cold temp)
                    </span>
                  </div>
                </div>
              </div>

              {/* Biological Degradation Indicators */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Vision Biomarker Observations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="font-semibold text-slate-400 mb-1">Surface Texture & Firmness</div>
                    <p className="text-slate-200">{result.surface_texture_notes}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="font-semibold text-slate-400 mb-1">Discoloration & Oxidation</div>
                    <p className="text-slate-200">{result.discoloration_observed}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="font-semibold text-slate-400 mb-1">Wrinkling, Wilting & Turgor</div>
                    <p className="text-slate-200">{result.wrinkling_or_wilting}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="font-semibold text-slate-400 mb-1">Mold Spores / Fungal Rot</div>
                    <p className={result.mold_or_rot_detected ? "text-rose-400 font-bold" : "text-emerald-400"}>
                      {result.mold_or_rot_detected ? "Detected (Active Mycelium / Spoilage)" : "None Detected"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Scientific Rationale */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs leading-relaxed space-y-1.5">
                <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                  <Microscope className="w-4 h-4 text-teal-400" />
                  <span>Microbiological & Enzymatic Assessment</span>
                </div>
                <p className="text-slate-300">{result.scientific_rationale}</p>
              </div>

              {/* Preservation & Storage Tips */}
              {result.preservation_storage_tips && result.preservation_storage_tips.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Archive className="w-4 h-4" />
                    <span>Preservation & Storage Protocols</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.preservation_storage_tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-teal-400 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-12 rounded-2xl border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Microscope className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">Ready for Freshness Diagnostic</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Upload a photo of fruits, produce, meat, or dairy to analyze surface texture, discoloration, and get safety expiration advice.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
