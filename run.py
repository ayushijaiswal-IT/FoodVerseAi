"""
Food Verse AI - Application Launcher
Runs the complete production Full-Stack service (FastAPI + React SPA + SQLite)
"""
import webbrowser
import time
import uvicorn
from threading import Timer

def open_browser():
    time.sleep(1.2)
    print("\n[+] Opening Food Verse AI in your default web browser: http://localhost:8000")
    webbrowser.open("http://localhost:8000")

if __name__ == "__main__":
    print("=" * 65)
    print("  FOOD VERSE AI - MULTIMODAL FOOD INTELLIGENCE AGENT")
    print("  Platform ID: 6ac4ca021dcde6d7857c169a")
    print("=" * 65)
    print("Starting FastAPI Backend + Embedded React SPA on http://127.0.0.1:8000 ...")
    
    # Launch browser after slight delay
    Timer(1.5, open_browser).start()
    
    # Run Uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=False)
