import os
import json
import asyncio
from fastapi.testclient import TestClient
from backend.main import app
from backend.database import get_db_connection, get_dashboard_stats

client = TestClient(app)

def test_full_pipeline():
    print("=" * 60)
    print("TESTING FOOD VERSE AI MULTIMODAL INTELLIGENCE AGENT")
    print("=" * 60)

    # 1. Health Check
    print("\n[1] Testing Health Check Endpoint...")
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    health = res.json()
    print("    Health Response:", health)
    assert health["status"] == "healthy"

    # 2. Nutrition Audit Test
    print("\n[2] Testing Nutrition Recognition & Audit Endpoint (Epic 2)...")
    salad_path = "assets/samples/mediterranean_salad.jpg"
    assert os.path.exists(salad_path), "Salad sample image missing"
    with open(salad_path, "rb") as f:
        res = client.post(
            "/api/nutrition/analyze",
            files={"file": ("mediterranean_salad.jpg", f, "image/jpeg")},
            data={"user_notes": "Organic quinoa avocado super salad with spinach", "provider": "gemini"}
        )
    assert res.status_code == 200, f"Nutrition audit failed: {res.text}"
    nutr = res.json()
    print(f"    Recognized Dish: {nutr['dish_name']}")
    print(f"    Calories: {nutr['total_calories']} kcal | Health Score: {nutr['health_score']}/100")
    print(f"    Macros: P={nutr['total_protein']}g, C={nutr['total_carbs']}g, F={nutr['total_fat']}g, Fib={nutr['total_fiber']}g")
    assert nutr["health_score"] >= 1 and nutr["health_score"] <= 100

    # 3. Freshness Diagnostic Test (Fresh item)
    print("\n[3] Testing Freshness Diagnostic (Fresh Item - Epic 3)...")
    straw_path = "assets/samples/fresh_strawberries.jpg"
    with open(straw_path, "rb") as f:
        res = client.post(
            "/api/freshness/diagnose",
            files={"file": ("strawberries.jpg", f, "image/jpeg")},
            data={"food_name_hint": "Organic Strawberries", "provider": "gemini"}
        )
    assert res.status_code == 200, f"Freshness failed: {res.text}"
    fresh = res.json()
    print(f"    Item: {fresh['item_detected']} | Stage: {fresh['freshness_stage']}")
    print(f"    Action: {fresh['safety_action']} | Remaining Days: {fresh['shelf_life_remaining_days']}")
    assert fresh["freshness_stage"] in ["Fresh", "Moderately Fresh", "Spoiled"]

    # 4. Freshness Diagnostic Test (Spoiled item)
    print("\n[4] Testing Freshness Diagnostic (Spoiled Item - Epic 3)...")
    avoc_path = "assets/samples/spoiled_avocado.jpg"
    with open(avoc_path, "rb") as f:
        res = client.post(
            "/api/freshness/diagnose",
            files={"file": ("spoiled_avocado.jpg", f, "image/jpeg")},
            data={"food_name_hint": "Avocado", "provider": "gemini"}
        )
    assert res.status_code == 200, f"Spoiled diagnostic failed: {res.text}"
    spoiled = res.json()
    print(f"    Item: {spoiled['item_detected']} | Stage: {spoiled['freshness_stage']}")
    print(f"    Mold Detected: {spoiled['mold_or_rot_detected']} | Directive: {spoiled['safety_action']}")

    # 5. Kitchen Hygiene Audit (Epic 4)
    print("\n[5] Testing Commercial Kitchen Hygiene Audit (Epic 4)...")
    kitch_path = "assets/samples/commercial_kitchen.jpg"
    with open(kitch_path, "rb") as f:
        res = client.post(
            "/api/hygiene/audit",
            files={"file": ("commercial_kitchen.jpg", f, "image/jpeg")},
            data={"inspection_notes": "Hot line prep counter with raw poultry and produce", "provider": "gemini"}
        )
    assert res.status_code == 200, f"Hygiene audit failed: {res.text}"
    hygiene = res.json()
    print(f"    Zone: {hygiene['kitchen_zone']}")
    print(f"    Compliance Score: {hygiene['overall_compliance_score']}% | Grade: {hygiene['compliance_grade']}")
    print(f"    Violations Logged: {len(hygiene.get('itemized_violations', []))}")
    assert hygiene["overall_compliance_score"] >= 0

    # 6. Smart Recipe Assistant (Epic 4)
    print("\n[6] Testing Smart Recipe Assistant (Epic 4)...")
    res = client.post(
        "/api/recipes/generate",
        json={
            "pantry_ingredients": ["Baby Spinach", "Eggs", "Garlic", "Extra Virgin Olive Oil", "Quinoa"],
            "cuisine_preference": "Mediterranean",
            "dietary_filter": "Vegetarian",
            "max_cooking_time_mins": 25,
            "skill_level": "Easy"
        }
    )
    assert res.status_code == 200, f"Recipe failed: {res.text}"
    recipe = res.json()
    print(f"    Recipe Title: {recipe['recipe_title']}")
    print(f"    Cooking Time: {recipe['cooking_time_mins']} mins | Calories: {recipe['calories_per_serving']} kcal")
    print(f"    Steps: {len(recipe['step_by_step'])} steps generated")
    assert len(recipe["step_by_step"]) > 0

    # 7. Personalized Meal Planner (Epic 5)
    print("\n[7] Testing BMR/TDEE Meal Planner (Epic 5)...")
    res = client.post(
        "/api/mealplan/calculate",
        json={
            "name": "Dr. Jordan Hayes",
            "age": 30,
            "gender": "Male",
            "weight_kg": 75.0,
            "height_cm": 180.0,
            "activity_level": "Moderately Active",
            "dietary_constraint": "Balanced",
            "fitness_goal": "Fat Loss"
        }
    )
    assert res.status_code == 200, f"Meal plan failed: {res.text}"
    plan = res.json()
    print(f"    BMR: {plan['bmr']} kcal | TDEE: {plan['tdee']} kcal")
    print(f"    Target Daily Calories: {plan['target_daily_calories']} kcal")
    print(f"    Protein Target: {plan['macro_targets']['protein_g']}g")
    print(f"    7-Day Schedule Count: {len(plan['seven_day_schedule'])} days")
    print(f"    Grocery Departments: {list(plan['automated_grocery_list'].keys())}")
    assert len(plan["seven_day_schedule"]) == 7

    # 8. SQLite Database Verification (Epic 6)
    print("\n[8] Verifying SQLite Database Records & Dashboard Analytics...")
    stats = get_dashboard_stats()
    print(f"    Database Analytics: {stats}")
    assert stats["total_audits"] >= 4, "Audits not properly recorded to SQLite"

    print("\n" + "=" * 60)
    print("ALL MODULE TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 60)

if __name__ == "__main__":
    test_full_pipeline()
