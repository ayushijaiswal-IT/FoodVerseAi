from fastapi import APIRouter, HTTPException
from typing import List
from backend.ai_engine import ai_engine
from backend.database import log_analysis, get_db_connection
from backend.models import RecipeRequest
from datetime import datetime

router = APIRouter(prefix="/api/recipes", tags=["Recipes"])

@router.post("/generate")
async def generate_recipe(req: RecipeRequest):
    try:
        recipe = await ai_engine.generate_smart_recipe(
            pantry_items=req.pantry_ingredients,
            cuisine=req.cuisine_preference or "Any",
            dietary=req.dietary_filter or "None",
            max_time=req.max_cooking_time_mins or 30,
            skill_level=req.skill_level or "Easy"
        )
        
        # Log to analysis_history
        log_id = log_analysis(
            module="recipe",
            input_title=recipe.get("recipe_title", "Custom Recipe"),
            result_dict=recipe,
            score=float(recipe.get("calories_per_serving", 400.0)),
            status="Generated"
        )
        recipe["db_id"] = log_id
        return recipe
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recipe generation failed: {str(e)}")

@router.get("/pantry")
def get_pantry_items():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT id, name, category, quantity, added_at FROM pantry_items ORDER BY id DESC")
    rows = c.fetchall()
    items = [{"id": r["id"], "name": r["name"], "category": r["category"], "quantity": r["quantity"], "added_at": r["added_at"]} for r in rows]
    conn.close()
    return items

@router.post("/pantry")
def add_pantry_item(name: str, category: str = "General", quantity: str = "1"):
    conn = get_db_connection()
    c = conn.cursor()
    ts = datetime.now().isoformat()
    c.execute("INSERT INTO pantry_items (name, category, quantity, added_at) VALUES (?, ?, ?, ?)", (name, category, quantity, ts))
    item_id = c.lastrowid
    conn.commit()
    conn.close()
    return {"id": item_id, "name": name, "category": category, "quantity": quantity, "added_at": ts}

@router.delete("/pantry/{item_id}")
def delete_pantry_item(item_id: int):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM pantry_items WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return {"status": "deleted", "id": item_id}
