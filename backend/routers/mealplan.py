from fastapi import APIRouter, HTTPException
from backend.ai_engine import ai_engine
from backend.database import log_analysis, get_db_connection
from backend.models import UserProfileInput
from datetime import datetime
import json

router = APIRouter(prefix="/api/mealplan", tags=["Meal Planner"])

@router.post("/calculate")
def calculate_meal_plan(profile: UserProfileInput):
    try:
        plan = ai_engine.calculate_bmr_tdee(
            age=profile.age,
            gender=profile.gender,
            weight_kg=profile.weight_kg,
            height_cm=profile.height_cm,
            activity=profile.activity_level,
            goal=profile.fitness_goal,
            diet=profile.dietary_constraint
        )
        plan["user_name"] = profile.name
        
        # Save or update profile in user_profiles
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("""
            INSERT INTO user_profiles (
                user_name, age, gender, weight_kg, height_cm, activity_level, dietary_constraint, fitness_goal,
                bmr, tdee, target_calories, target_protein, target_carbs, target_fat, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            profile.name, profile.age, profile.gender, profile.weight_kg, profile.height_cm, profile.activity_level,
            profile.dietary_constraint, profile.fitness_goal, plan["bmr"], plan["tdee"], plan["target_daily_calories"],
            plan["macro_targets"]["protein_g"], plan["macro_targets"]["carbs_g"], plan["macro_targets"]["fat_g"],
            datetime.now().isoformat()
        ))
        conn.commit()
        conn.close()

        # Log analysis
        log_id = log_analysis(
            module="mealplan",
            input_title=f"{profile.name}'s {profile.fitness_goal} Plan ({profile.dietary_constraint})",
            result_dict=plan,
            score=float(plan["target_daily_calories"]),
            status="Active"
        )
        plan["db_id"] = log_id
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Meal plan computation failed: {str(e)}")

@router.get("/profile")
def get_latest_profile():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM user_profiles ORDER BY id DESC LIMIT 1")
    row = c.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

@router.get("/grocery")
def get_grocery_items():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT id, item_name, category, quantity, is_purchased FROM grocery_list ORDER BY id ASC")
    rows = c.fetchall()
    items = [{"id": r["id"], "item_name": r["item_name"], "category": r["category"], "quantity": r["quantity"], "is_purchased": bool(r["is_purchased"])} for r in rows]
    conn.close()
    return items

@router.post("/grocery/toggle/{item_id}")
def toggle_grocery_item(item_id: int):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("UPDATE grocery_list SET is_purchased = CASE WHEN is_purchased = 1 THEN 0 ELSE 1 END WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return {"status": "toggled", "id": item_id}
