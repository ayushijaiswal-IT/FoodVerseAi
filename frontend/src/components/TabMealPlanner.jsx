import React, { useState } from "react";
import { 
  CalendarRange, 
  Flame, 
  Dumbbell, 
  ShoppingCart, 
  User, 
  Sparkles, 
  Check, 
  Loader2, 
  Info,
  Clock,
  HeartPulse
} from "lucide-react";
import { calculateMealPlanApi } from "../api";

export default function TabMealPlanner() {
  const [profile, setProfile] = useState({
    name: "Alex Vance",
    age: 28,
    gender: "Male",
    weight_kg: 74,
    height_cm: 178,
    activity_level: "Moderately Active",
    dietary_constraint: "Balanced",
    fitness_goal: "Fat Loss"
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  const handleCompute = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await calculateMealPlanApi(profile);
      setPlan(data);
      setActiveDayIdx(0);
    } catch (err) {
      setError(err.message || "Failed to calculate meal plan");
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (item) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-slate-900/60 to-indigo-950/20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold mb-3">
            <CalendarRange className="w-3.5 h-3.5" />
            <span>Epic 5: Clinical TDEE Calculator & Adaptive 7-Day Meal Schedule</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Personalized BMR/TDEE Meal Planner
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Formulate scientific caloric and macronutrient targets via Mifflin-St Jeor metabolic modeling, generating a 7-day adaptive meal plan and departmental supermarket checklist.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: User Profile Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleCompute} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <User className="w-4 h-4 text-purple-400" />
              <span>Biometric & Fitness Parameters</span>
            </h3>

            {/* Name & Age */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">User Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Age (Years)</label>
                <input
                  type="number"
                  min="14"
                  max="100"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 25 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Gender, Weight & Height */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={profile.weight_kg}
                  onChange={(e) => setProfile({ ...profile, weight_kg: parseFloat(e.target.value) || 70 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={profile.height_cm}
                  onChange={(e) => setProfile({ ...profile, height_cm: parseFloat(e.target.value) || 175 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Activity Multiplier</label>
              <select
                value={profile.activity_level}
                onChange={(e) => setProfile({ ...profile, activity_level: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Sedentary">Sedentary (Desk job, little to no exercise)</option>
                <option value="Lightly Active">Lightly Active (Workouts 1-3 days/wk)</option>
                <option value="Moderately Active">Moderately Active (Moderate exercise 3-5 days/wk)</option>
                <option value="Very Active">Very Active (Hard training 6-7 days/wk)</option>
                <option value="Extra Active">Extra Active (Intense athlete / physical job)</option>
              </select>
            </div>

            {/* Dietary Constraints & Fitness Goal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Dietary Constraint</label>
                <select
                  value={profile.dietary_constraint}
                  onChange={(e) => setProfile({ ...profile, dietary_constraint: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Balanced">Balanced Whole-Foods</option>
                  <option value="Vegan">Vegan (100% Plant)</option>
                  <option value="Vegetarian">Vegetarian (Lacto-Ovo)</option>
                  <option value="Keto">Ketogenic (High-Fat/Low-Carb)</option>
                  <option value="Diabetic-Friendly">Diabetic-Friendly (Low-GI)</option>
                  <option value="Mediterranean">Mediterranean Heart-Health</option>
                  <option value="Gluten-Free">Gluten-Free Celiac Safe</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Fitness Target</label>
                <select
                  value={profile.fitness_goal}
                  onChange={(e) => setProfile({ ...profile, fitness_goal: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Fat Loss">Fat Loss (-500 kcal deficit)</option>
                  <option value="Muscle Gain">Muscle Gain (+400 kcal surplus)</option>
                  <option value="Maintenance">Weight Maintenance</option>
                  <option value="Endurance">Athletic Endurance</option>
                </select>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing Metabolic Targets...</span>
                </>
              ) : (
                <>
                  <HeartPulse className="w-4 h-4" />
                  <span>Calculate TDEE & 7-Day Plan</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Right: Meal Plan Output (7 cols) */}
        <div className="lg:col-span-7">
          {plan ? (
            <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-6 animate-in fade-in duration-300">
              {/* Metabolic Header Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Basal Metabolic Rate</div>
                  <div className="text-xl font-extrabold text-white font-display mt-0.5">
                    {plan.bmr} <span className="text-xs font-normal text-slate-400">kcal</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Daily TDEE</div>
                  <div className="text-xl font-extrabold text-purple-400 font-display mt-0.5">
                    {plan.tdee} <span className="text-xs font-normal text-slate-400">kcal</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30">
                  <div className="text-[10px] text-purple-300 font-semibold uppercase">Target Daily Cal</div>
                  <div className="text-xl font-black text-white font-display mt-0.5">
                    {plan.target_daily_calories} <span className="text-xs font-normal text-purple-300">kcal</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Target Protein</div>
                  <div className="text-xl font-extrabold text-emerald-400 font-display mt-0.5">
                    {plan.macro_targets?.protein_g} <span className="text-xs font-normal text-slate-400">g</span>
                  </div>
                </div>
              </div>

              {/* Macro Distribution Bar */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-300">Macro Allocation</span>
                  <div className="space-x-3 text-[11px]">
                    <span className="text-blue-400 font-bold">Protein: {plan.macro_targets?.protein_g}g</span>
                    <span className="text-emerald-400 font-bold">Carbs: {plan.macro_targets?.carbs_g}g</span>
                    <span className="text-rose-400 font-bold">Fats: {plan.macro_targets?.fat_g}g</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden flex bg-slate-800">
                  <div style={{ width: '30%' }} className="bg-blue-500" />
                  <div style={{ width: '45%' }} className="bg-emerald-500" />
                  <div style={{ width: '25%' }} className="bg-rose-500" />
                </div>
              </div>

              {/* 7-Day Day Selector */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
                  <CalendarRange className="w-4 h-4 text-purple-400" />
                  <span>7-Day Adaptive Schedule</span>
                </h4>
                <div className="grid grid-cols-7 gap-1">
                  {(plan.seven_day_schedule || []).map((day, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveDayIdx(idx)}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold border transition text-center ${
                        activeDayIdx === idx
                          ? "bg-purple-500 text-white border-purple-400 shadow-md shadow-purple-500/30"
                          : "bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800"
                      }`}
                    >
                      <div className="text-[10px] opacity-75">{day.day.slice(0, 3)}</div>
                      <div className="text-[11px] font-bold">{day.total_calories}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Day's Meals */}
              {plan.seven_day_schedule?.[activeDayIdx] && (
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-200">
                    {plan.seven_day_schedule[activeDayIdx].day}'s Prescribed Menu
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {plan.seven_day_schedule[activeDayIdx].meals.map((meal, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-1.5 py-0.5 rounded bg-purple-500/10">
                            {meal.meal_type}
                          </span>
                          <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{meal.prep_time_mins}m</span>
                          </span>
                        </div>
                        <div className="font-extrabold text-white text-sm line-clamp-1">
                          {meal.dish_name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {meal.calories} kcal • {meal.protein_g}g Protein • {meal.carbs_g}g Carbs
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Automated Grocery Shopping List */}
              {plan.automated_grocery_list && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShoppingCart className="w-4 h-4 text-emerald-400" />
                    <span>Automated Supermarket Grocery Checklist</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {Object.entries(plan.automated_grocery_list).map(([category, items], idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="font-bold text-purple-400 text-[11px] uppercase tracking-wider">
                          {category}
                        </div>
                        <div className="space-y-1">
                          {items.map((item, itemIdx) => {
                            const isChecked = checkedItems[item];
                            return (
                              <label
                                key={itemIdx}
                                onClick={() => toggleCheck(item)}
                                className={`flex items-center space-x-2 p-1.5 rounded-lg cursor-pointer transition ${
                                  isChecked ? "bg-emerald-950/30 text-slate-500 line-through" : "hover:bg-slate-800 text-slate-300"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                  isChecked ? "bg-emerald-500 border-emerald-400 text-slate-950" : "border-slate-600 bg-slate-900"
                                }`}>
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className="text-xs select-none">{item}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Recommendation */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/25 text-xs text-slate-300 leading-relaxed flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-purple-300 mb-0.5">Metabolic Scientist Note</div>
                  {plan.nutritionist_recommendation}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 rounded-2xl border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <CalendarRange className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">Personalize Your Dietary Architecture</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Fill in your age, gender, biometric stats, and fitness goals to calculate metabolic BMR/TDEE and unlock your 7-day schedule.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
