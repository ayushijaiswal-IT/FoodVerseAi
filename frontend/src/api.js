const API_BASE = "http://127.0.0.1:8000";

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    return { status: "offline", demo_mode: true, error: err.message };
  }
}

export async function analyzeNutritionApi(fileOrBlob, userNotes, apiKey, provider) {
  const formData = new FormData();
  formData.append("file", fileOrBlob);
  formData.append("user_notes", userNotes || "");
  formData.append("api_key", apiKey || "");
  formData.append("provider", provider || "gemini");

  const res = await fetch(`${API_BASE}/api/nutrition/analyze`, {
    method: "POST",
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Nutrition analysis failed");
  }
  return await res.json();
}

export async function diagnoseFreshnessApi(fileOrBlob, foodHint, apiKey, provider) {
  const formData = new FormData();
  formData.append("file", fileOrBlob);
  formData.append("food_name_hint", foodHint || "");
  formData.append("api_key", apiKey || "");
  formData.append("provider", provider || "gemini");

  const res = await fetch(`${API_BASE}/api/freshness/diagnose`, {
    method: "POST",
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Freshness diagnostic failed");
  }
  return await res.json();
}

export async function auditHygieneApi(fileOrBlob, inspectionNotes, apiKey, provider) {
  const formData = new FormData();
  formData.append("file", fileOrBlob);
  formData.append("inspection_notes", inspectionNotes || "");
  formData.append("api_key", apiKey || "");
  formData.append("provider", provider || "gemini");

  const res = await fetch(`${API_BASE}/api/hygiene/audit`, {
    method: "POST",
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Hygiene audit failed");
  }
  return await res.json();
}

export async function generateRecipeApi(payload) {
  const res = await fetch(`${API_BASE}/api/recipes/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Recipe generation failed");
  }
  return await res.json();
}

export async function calculateMealPlanApi(profile) {
  const res = await fetch(`${API_BASE}/api/mealplan/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Meal plan calculation failed");
  }
  return await res.json();
}

export async function getHistoryApi() {
  const res = await fetch(`${API_BASE}/api/history/`);
  if (!res.ok) throw new Error("Failed to load history");
  return await res.json();
}

export async function getStatsApi() {
  const res = await fetch(`${API_BASE}/api/history/stats`);
  if (!res.ok) throw new Error("Failed to load stats");
  return await res.json();
}
