import sqlite3
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from backend.config import settings

def get_db_connection():
    conn = sqlite3.connect(settings.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Analysis History (for audits, food diagnostics, hygiene reports, recipes, mealplans)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analysis_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        module TEXT NOT NULL,
        input_title TEXT NOT NULL,
        result_json TEXT NOT NULL,
        score REAL,
        status TEXT
    )
    """)
    
    # 2. User Profiles (BMR, TDEE, preferences, goals)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT DEFAULT 'FoodVerse Chef',
        age INTEGER,
        gender TEXT,
        weight_kg REAL,
        height_cm REAL,
        activity_level TEXT,
        dietary_constraint TEXT,
        fitness_goal TEXT,
        bmr REAL,
        tdee REAL,
        target_calories REAL,
        target_protein REAL,
        target_carbs REAL,
        target_fat REAL,
        updated_at TEXT
    )
    """)
    
    # 3. Pantry Items
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pantry_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        quantity TEXT,
        expiry_estimate TEXT,
        added_at TEXT
    )
    """)
    
    # 4. Commercial Kitchen Audits
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS hygiene_audits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        kitchen_area TEXT,
        overall_score REAL NOT NULL,
        compliance_level TEXT NOT NULL,
        violations_count INTEGER,
        audit_details TEXT
    )
    """)
    
    # 5. Grocery Checklist
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS grocery_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        category TEXT,
        quantity TEXT,
        is_purchased INTEGER DEFAULT 0,
        plan_day TEXT
    )
    """)

    conn.commit()
    conn.close()

def log_analysis(module: str, input_title: str, result_dict: Dict[str, Any], score: Optional[float] = None, status: Optional[str] = "Success") -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    ts = datetime.now().isoformat()
    cursor.execute(
        "INSERT INTO analysis_history (timestamp, module, input_title, result_json, score, status) VALUES (?, ?, ?, ?, ?, ?)",
        (ts, module, input_title, json.dumps(result_dict), score, status)
    )
    item_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return item_id

def get_recent_history(limit: int = 20) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, timestamp, module, input_title, result_json, score, status FROM analysis_history ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "timestamp": r["timestamp"],
            "module": r["module"],
            "input_title": r["input_title"],
            "result": json.loads(r["result_json"]) if r["result_json"] else {},
            "score": r["score"],
            "status": r["status"]
        })
    conn.close()
    return results

def get_dashboard_stats() -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM analysis_history")
    total_audits = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM analysis_history WHERE module = 'nutrition'")
    nutrition_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM analysis_history WHERE module = 'freshness'")
    freshness_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM analysis_history WHERE module = 'hygiene'")
    hygiene_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT AVG(score) FROM analysis_history WHERE module = 'hygiene'")
    avg_hygiene = cursor.fetchone()[0] or 88.5
    
    cursor.execute("SELECT COUNT(*) FROM pantry_items")
    pantry_count = cursor.fetchone()[0]
    
    conn.close()
    return {
        "total_audits": total_audits,
        "nutrition_scans": nutrition_count,
        "freshness_diagnostics": freshness_count,
        "hygiene_audits": hygiene_count,
        "avg_hygiene_score": round(avg_hygiene, 1),
        "pantry_items_tracked": pantry_count
    }
