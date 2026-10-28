import React, { useState } from "react";
import { 
  ChefHat, 
  Plus, 
  X, 
  Clock, 
  Flame, 
  Sparkles, 
  Shuffle, 
  CheckCircle2, 
  Loader2, 
  BookOpen, 
  Lightbulb, 
  ListPlus 
} from "lucide-react";
import { generateRecipeApi } from "../api";

export default function TabRecipes() {
  const [ingredients, setIngredients] = useState([
    "Baby Spinach", "Eggs", "Garlic", "Extra Virgin Olive Oil", "Quinoa", "Chicken Breast"
  ]);
  const [inputVal, setInputVal] = useState("");
  const [cuisine, setCuisine] = useState("Any");
  const [dietary, setDietary] = useState("None");
  const [maxTime, setMaxTime] = useState(30);
  const [skillLevel, setSkillLevel] = useState("Easy");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const quickStaples = ["Avocado", "Cherry Tomatoes", "Tofu", "Lentils", "Brown Rice", "Feta Cheese", "Salmon Fillet"];

  const handleAddIngredient = (item) => {
    const name = (item || inputVal).trim();
    if (name && !ingredients.includes(name)) {
      setIngredients([...ingredients, name]);
      setInputVal("");
    }
  };

  const handleRemoveIngredient = (item) => {
    setIngredients(ingredients.filter((i) => i !== item));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      setError("Please add at least 1 pantry ingredient.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await generateRecipeApi({
        pantry_ingredients: ingredients,
        cuisine_preference: cuisine,
        dietary_filter: dietary,
        max_cooking_time_mins: parseInt(maxTime, 10),
        skill_level: skillLevel
      });
      setRecipe(data);
    } catch (err) {
      setError(err.message || "Failed to generate recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-orange-950/20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-3">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Epic 4: AI Culinary Coach & Zero-Waste Pantry Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Smart Kitchen Recipe Assistant
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Enter items currently in your fridge or pantry to generate chef-grade, nutritious recipes with precise prep times, smart ingredient substitutions, and step-by-step guidance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pantry Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ListPlus className="w-4 h-4 text-amber-400" />
              <span>Pantry & Fridge Inventory</span>
            </h3>

            {/* Input Tag Adder */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
                placeholder="Add ingredient e.g. Broccoli, Lentils..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => handleAddIngredient()}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Current Tags */}
            <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              {ingredients.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-200 border border-amber-500/30 text-xs font-medium"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(item)}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {ingredients.length === 0 && (
                <span className="text-xs text-slate-500 italic">No ingredients in inventory yet</span>
              )}
            </div>

            {/* Quick Staples */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Quick Add Staples:
              </span>
              <div className="flex flex-wrap gap-1">
                {quickStaples.map((st, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddIngredient(st)}
                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-amber-950/40 text-[11px] text-slate-300 hover:text-amber-300 border border-slate-700 transition"
                  >
                    + {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters: Cuisine, Dietary, Cook Time */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Cuisine Style</label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Any">Any Style</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Asian Fusion">Asian Fusion</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Continental">Continental</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Dietary Filter</label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="None">None (Standard)</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Keto">Keto / Low-Carb</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                  <option value="High-Protein">High-Protein</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Max Cooking Time</label>
                <select
                  value={maxTime}
                  onChange={(e) => setMaxTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={15}>15 Minutes (Express)</option>
                  <option value={30}>30 Minutes (Standard)</option>
                  <option value={45}>45 Minutes (Gourmet)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Skill Level</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Easy">Easy (Beginner)</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Master Chef">Master Chef</option>
                </select>
              </div>
            </div>

            {/* Generate Recipe Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Formulating Creative Recipe...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Nutritious Recipe</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right: Recipe Output (7 cols) */}
        <div className="lg:col-span-7">
          {recipe ? (
            <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 space-y-6 animate-in fade-in duration-300">
              {/* Header */}
              <div className="border-b border-slate-800 pb-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                    {recipe.cuisine}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Prep: {recipe.prep_time_mins}m | Cook: {recipe.cooking_time_mins}m</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">Difficulty: {recipe.difficulty}</span>
                </div>
                <h3 className="text-2xl font-black text-white font-display">
                  {recipe.recipe_title}
                </h3>
              </div>

              {/* Nutrition Snapshot */}
              <div className="grid grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Calories</div>
                  <div className="text-lg font-black text-amber-400 font-display">{recipe.calories_per_serving}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Protein</div>
                  <div className="text-lg font-black text-blue-400 font-display">{recipe.macros?.protein || 30}g</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Carbs</div>
                  <div className="text-lg font-black text-emerald-400 font-display">{recipe.macros?.carbs || 40}g</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Fats</div>
                  <div className="text-lg font-black text-rose-400 font-display">{recipe.macros?.fat || 15}g</div>
                </div>
              </div>

              {/* Smart Substitutions Box */}
              {recipe.smart_substitutions && Object.keys(recipe.smart_substitutions).length > 0 && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/25 space-y-2">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <Shuffle className="w-4 h-4" />
                    <span>Smart Culinary Substitutions</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(recipe.smart_substitutions).map(([orig, sub], idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-900/60 border border-amber-500/20 text-slate-300">
                        <span className="line-through text-slate-500 mr-1.5">{orig}</span>
                        <span className="text-amber-400 font-semibold">➔ {sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step-by-Step Instructions */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Step-by-Step Cooking Guide</span>
                </h4>
                <div className="space-y-3">
                  {(recipe.step_by_step || []).map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center space-x-2 font-bold text-amber-400">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[11px]">
                          {step.step_number}
                        </span>
                        <span>Step {step.step_number}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed pl-7">{step.instruction}</p>
                      {step.tip && (
                        <div className="pl-7 text-[11px] text-slate-400 flex items-center space-x-1">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span>Pro Tip: {step.tip}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef Notes */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs leading-relaxed text-slate-300">
                <span className="font-bold text-amber-400 mr-1.5">Executive Chef Note:</span>
                {recipe.chef_notes}
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 rounded-2xl border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ChefHat className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">Pantry Ready for Inspiration</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Add available items from your pantry on the left and let Food Verse AI design a customized, healthy recipe.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
