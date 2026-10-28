import os

class Settings:
    PROJECT_NAME: str = "Food Verse AI"
    VERSION: str = "2.0.0"
    PLATFORM_ID: str = "6ac4ca021dcde6d7857c169a"
    CAPSTONE_TITLE: str = "Multimodal Food Intelligence Agent"
    
    # API Keys (support environment variables or UI runtime overrides)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Database
    DB_PATH: str = os.getenv("FOODVERSE_DB_PATH", "foodverse.db")
    
    # Fallback / Demonstration mode default
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")

settings = Settings()
