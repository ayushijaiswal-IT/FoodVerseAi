from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# 1. Configuration & Engine
class ApiConfigModel(BaseModel):
    gemini_key: Optional[str] = None
    groq_key: Optional[str] = None
    openai_key: Optional[str] = None
    active_engine: Optional[str] = "gemini-1.5-flash"
    demo_mode: bool = True

# 2. Nutrition Module (Epic 2)
class NutritionItem(BaseModel):
    name: str
    portion_grams: float
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float

class NutritionAuditResponse(BaseModel):
    dish_name: str
    cuisine: str
    portion_estimate: str
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float
    total_fiber: float
    health_score: int = Field(..., ge=1, le=100)
    micronutrients: Dict[str, str] = Field(default_factory=dict)
    allergen_alerts: List[str] = Field(default_factory=list)
    dietary_tags: List[str] = Field(default_factory=list)
    key_ingredients: List[str] = Field(default_factory=list)
    dietitian_summary: str
    confidence_score: float

# 3. Freshness Module (Epic 3)
class FreshnessDiagnosticResponse(BaseModel):
    item_detected: str
    food_category: str
    freshness_stage: str # "Fresh" | "Moderately Fresh" | "Spoiled"
    freshness_index_percent: float
    surface_texture_notes: str
    discoloration_observed: str
    wrinkling_or_wilting: str
    mold_or_rot_detected: bool
    safety_action: str # "Safe to consume" | "Consume within 24h" | "Discard immediately"
    shelf_life_remaining_days: int
    preservation_storage_tips: List[str]
    scientific_rationale: str

# 4. Hygiene Module (Epic 4)
class HygieneViolation(BaseModel):
    id: str
    hazard_type: str # "PPE Non-compliance", "Cross-contamination", "Sanitation Defect"
    severity: str # "Critical", "Moderate", "Minor"
    location: str
    description: str
    remediation_action: str

class KitchenHygieneResponse(BaseModel):
    kitchen_zone: str
    overall_compliance_score: float # 0 - 100%
    compliance_grade: str # A, B, C, Violation Notice
    chef_hat_hairnet_status: str # "Compliant (100%)", "Partial", "Non-compliant"
    glove_usage_status: str # "Compliant", "Missing on Food Handler", etc.
    sanitization_state: str # "Cleaned & Dry", "Dirty Surfaces Detected", etc.
    cross_contamination_alert: Optional[str] = None
    itemized_violations: List[HygieneViolation] = Field(default_factory=list)
    haccp_summary: str

# 5. Recipe Assistant (Epic 4)
class RecipeRequest(BaseModel):
    pantry_ingredients: List[str]
    cuisine_preference: Optional[str] = "Any"
    dietary_filter: Optional[str] = "None"
    max_cooking_time_mins: Optional[int] = 30
    skill_level: Optional[str] = "Easy"

class RecipeStep(BaseModel):
    step_number: int
    instruction: str
    tip: Optional[str] = None

class SmartRecipe(BaseModel):
    recipe_title: str
    cuisine: str
    servings: int
    prep_time_mins: int
    cooking_time_mins: int
    difficulty: str # "Easy" | "Intermediate" | "Master Chef"
    calories_per_serving: float
    macros: Dict[str, float] # protein, carbs, fat, fiber
    ingredients_used: List[str]
    missing_staples: List[str] = Field(default_factory=list)
    smart_substitutions: Dict[str, str] = Field(default_factory=dict)
    step_by_step: List[RecipeStep]
    chef_notes: str

# 6. Meal Planner (Epic 5)
class UserProfileInput(BaseModel):
    name: Optional[str] = "Guest Foodie"
    age: int = 28
    gender: str = "Male" # "Male", "Female", "Other"
    weight_kg: float = 72.0
    height_cm: float = 175.0
    activity_level: str = "Moderately Active" # Sedentary, Lightly Active, Moderately Active, Very Active, Extra Active
    dietary_constraint: str = "Balanced" # Vegan, Vegetarian, Keto, Paleo, Diabetic-Friendly, Mediterranean, Gluten-Free
    fitness_goal: str = "Fat Loss" # Fat Loss, Muscle Gain, Maintenance, Endurance
    allergies: Optional[List[str]] = Field(default_factory=list)

class DailyMealItem(BaseModel):
    meal_type: str # Breakfast, Lunch, Snack, Dinner
    dish_name: str
    calories: int
    protein_g: int
    carbs_g: int
    fat_g: int
    prep_time_mins: int
    key_ingredients: List[str]

class DaySchedule(BaseModel):
    day: str # "Monday", "Tuesday", etc.
    meals: List[DailyMealItem]
    total_calories: int
    total_protein: int

class MealPlanResponse(BaseModel):
    user_name: str
    bmr: float
    tdee: float
    target_daily_calories: float
    macro_targets: Dict[str, float] # protein_g, carbs_g, fat_g
    dietary_constraint: str
    fitness_goal: str
    seven_day_schedule: List[DaySchedule]
    automated_grocery_list: Dict[str, List[str]] # e.g. "Produce": [...], "Proteins": [...]
    nutritionist_recommendation: str
