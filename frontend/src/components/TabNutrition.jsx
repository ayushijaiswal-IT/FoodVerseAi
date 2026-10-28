import React, { useState } from "react";
import { 
  Upload, 
  Sparkles, 
  Flame, 
  Dumbbell, 
  Wheat, 
  Droplet, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  Image as ImageIcon 
} from "lucide-react";
import { analyzeNutritionApi } from "../api";

export default function TabNutrition({ config }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userNotes, setUserNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleDishes = [
    { label: "Mediterranean Salad Bowl", path: "/samples/mediterranean_salad.jpg", note: "Quinoa salad with avocado, olive oil, and baby spinach" },
    { label: "Grilled Atlantic Salmon", path: "/samples/fresh_strawberries.jpg", note: "Herb-crusted salmon fillet with charred green asparagus" },
    { label: "Sourdough Margherita Pizza", path: "/samples/spoiled_avocado.jpg", note: "San Marzano tomatoes, buffalo mozzarella, fresh basil" }
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
      setUserNotes(sample.note);
      setResult(null);
      setError(null);
      
      const res = await fetch(sample.path);
      const blob = await res.blob();
      const file = new File([blob], sample.path.split("/").pop(), { type: "image/jpeg" });
      setSelectedFile(file);
    } catch (err) {
      setError("Failed to load sample image: " + err.message);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select or upload a food image first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeNutritionApi(
        selectedFile,
        userNotes,
        config.geminiKey || config.groqKey,
        config.provider
      );
      setResult(data);
    } catch (err) {
      setError(err.message || "Analysis error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-teal-950/20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Epic 2: Food Recognition & Clinical Nutrition Breakdown</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Multimodal Food Recognition & Nutrition Audit
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Upload or capture any meal to identify dishes, portion sizing, comprehensive macronutrients, glycemic profile, allergen risks, and an automated composite Health Score (1-100).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Image Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Dish Photo & Context</span>
            </h3>

            {/* Drop Zone */}
            <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-900/40">
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
                    alt="Uploaded Meal"
                    className="w-full h-48 object-cover rounded-lg shadow-md mx-auto"
                  />
                  <p className="text-xs text-emerald-400 font-medium">Click or drag to change photo</p>
                </div>
              ) : (
                <div className="py-6 space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-slate-300">Upload dish photo (JPEG, PNG, WebP)</p>
                  <p className="text-[11px] text-slate-500">Camera snapshots, plated meals, bowls</p>
                </div>
              )}
            </div>

            {/* Quick Sample Selector */}
            <div className="mt-4">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Or Try Sample Dishes:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sampleDishes.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(s)}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/40 text-[11px] text-slate-300 hover:text-emerald-300 transition text-center line-clamp-1"
                  >
                    {s.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Context Input */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Optional Preparation Notes
              </label>
              <input
                type="text"
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="e.g. Made with olive oil, no added sugar, brown rice..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-5 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Multimodal Vision...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Nutrition Audit</span>
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

        {/* Right: Nutrition Audit Output (7 cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 space-y-6 animate-in fade-in duration-300">
              {/* Dish Header & Health Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      {result.cuisine} Cuisine
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">Portion: {result.portion_estimate}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mt-1 font-display">
                    {result.dish_name}
                  </h3>
                </div>

                {/* Composite Health Score Badge */}
                <div className="flex items-center space-x-3 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-700 shadow-inner">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle cx="24" cy="24" r="20" stroke="#1f2937" strokeWidth="4" fill="transparent" />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="#22c55e"
                        strokeWidth="4"
                        strokeDasharray={125.6}
                        strokeDashoffset={125.6 - (125.6 * (result.health_score || 85)) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute font-display font-extrabold text-sm text-white">
                      {result.health_score}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-400">Health Score</div>
                    <div className="text-[10px] text-slate-400">Out of 100</div>
                  </div>
                </div>
              </div>

              {/* Macro Nutrients Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-semibold mb-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Calories</span>
                  </div>
                  <div className="text-xl font-black text-white font-display">
                    {result.total_calories} <span className="text-xs font-normal text-slate-400">kcal</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center space-x-1.5 text-blue-400 text-xs font-semibold mb-1">
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>Protein</span>
                  </div>
                  <div className="text-xl font-black text-white font-display">
                    {result.total_protein} <span className="text-xs font-normal text-slate-400">g</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold mb-1">
                    <Wheat className="w-3.5 h-3.5" />
                    <span>Carbs</span>
                  </div>
                  <div className="text-xl font-black text-white font-display">
                    {result.total_carbs} <span className="text-xs font-normal text-slate-400">g</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center space-x-1.5 text-rose-400 text-xs font-semibold mb-1">
                    <Droplet className="w-3.5 h-3.5" />
                    <span>Fats (Lipids)</span>
                  </div>
                  <div className="text-xl font-black text-white font-display">
                    {result.total_fat} <span className="text-xs font-normal text-slate-400">g</span>
                  </div>
                </div>
              </div>

              {/* Dietary Tags & Allergen Warnings */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {(result.dietary_tags || []).map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-md bg-teal-500/15 text-teal-300 border border-teal-500/30 text-xs font-medium">
                    Dietary Fiber: {result.total_fiber || 5}g
                  </span>
                </div>

                {result.allergen_alerts && result.allergen_alerts.length > 0 && result.allergen_alerts[0] !== "None" && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Allergen Warning: Contains {result.allergen_alerts.join(", ")}</span>
                  </div>
                )}
              </div>

              {/* Micronutrient Scorecard */}
              {result.micronutrients && Object.keys(result.micronutrients).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Essential Micronutrients & Electrolytes
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(result.micronutrients).map(([k, v], idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex justify-between items-center text-xs">
                        <span className="text-slate-400">{k}</span>
                        <span className="font-semibold text-emerald-400">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dietitian Clinical Summary */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs leading-relaxed space-y-2">
                <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Clinical Nutritionist Analysis</span>
                </div>
                <p className="text-slate-300">{result.dietitian_summary}</p>
              </div>

              {/* Key Ingredients Identified */}
              {result.key_ingredients && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Identified Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.key_ingredients.map((ing, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-12 rounded-2xl border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">Ready to Audit Meal</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Select a sample image on the left or upload your own dish to calculate macro breakdown, vitamins, and health scores.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
