import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.config import settings
from backend.database import init_db
from backend.routers import nutrition, freshness, hygiene, recipes, mealplan, history

# Initialize SQLite database
init_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multimodal Food Intelligence Ecosystem - Skill Wallet Capstone Project 3"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(nutrition.router)
app.include_router(freshness.router)
app.include_router(hygiene.router)
app.include_router(recipes.router)
app.include_router(mealplan.router)
app.include_router(history.router)

# Mount sample assets if directory exists
samples_dir = os.path.join(os.path.dirname(__file__), "..", "assets", "samples")
if os.path.exists(samples_dir):
    app.mount("/samples", StaticFiles(directory=samples_dir), name="samples")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "platform_id": settings.PLATFORM_ID,
        "database": "sqlite_connected",
        "demo_mode": settings.DEMO_MODE,
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "groq_configured": bool(settings.GROQ_API_KEY)
    }

# Mount React frontend dist if built
dist_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="static-assets")

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        # Don't intercept API routes
        if full_path.startswith("api/") or full_path.startswith("samples/"):
            return None
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"status": "online", "message": "API running"}
else:
    @app.get("/")
    def root():
        return {
            "status": "online",
            "service": settings.PROJECT_NAME,
            "platform_id": settings.PLATFORM_ID,
            "version": settings.VERSION,
            "endpoints": [
                "/api/nutrition/analyze",
                "/api/freshness/diagnose",
                "/api/hygiene/audit",
                "/api/recipes/generate",
                "/api/mealplan/calculate",
                "/api/history"
            ]
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
