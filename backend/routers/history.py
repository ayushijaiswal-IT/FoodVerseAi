from fastapi import APIRouter
from backend.database import get_recent_history, get_dashboard_stats, get_db_connection

router = APIRouter(prefix="/api/history", tags=["History & Analytics"])

@router.get("/")
def fetch_history(limit: int = 30):
    return get_recent_history(limit=limit)

@router.get("/stats")
def fetch_stats():
    return get_dashboard_stats()

@router.delete("/clear")
def clear_all_history():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM analysis_history")
    conn.commit()
    conn.close()
    return {"status": "History cleared"}
