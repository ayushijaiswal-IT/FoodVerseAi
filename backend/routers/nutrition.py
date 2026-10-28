from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from backend.ai_engine import ai_engine
from backend.database import log_analysis
from backend.config import settings

router = APIRouter(prefix="/api/nutrition", tags=["Nutrition"])

@router.post("/analyze")
async def analyze_nutrition(
    file: UploadFile = File(...),
    user_notes: Optional[str] = Form(""),
    api_key: Optional[str] = Form(""),
    provider: Optional[str] = Form("gemini")
):
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty image file uploaded")
            
        key_to_use = api_key or settings.GEMINI_API_KEY
        result = await ai_engine.analyze_food_nutrition(
            image_bytes=contents,
            user_notes=user_notes,
            api_key=key_to_use,
            provider=provider
        )
        
        # Log to database
        log_id = log_analysis(
            module="nutrition",
            input_title=result.get("dish_name", file.filename or "Dish Scan"),
            result_dict=result,
            score=float(result.get("health_score", 85))
        )
        result["db_id"] = log_id
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Nutrition analysis failed: {str(e)}")
