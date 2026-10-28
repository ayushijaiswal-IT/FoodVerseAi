from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from backend.ai_engine import ai_engine
from backend.database import log_analysis
from backend.config import settings

router = APIRouter(prefix="/api/freshness", tags=["Freshness"])

@router.post("/diagnose")
async def diagnose_freshness(
    file: UploadFile = File(...),
    food_name_hint: Optional[str] = Form(""),
    api_key: Optional[str] = Form(""),
    provider: Optional[str] = Form("gemini")
):
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty image file uploaded")
            
        key_to_use = api_key or settings.GEMINI_API_KEY
        result = await ai_engine.analyze_freshness(
            image_bytes=contents,
            food_name_hint=food_name_hint,
            api_key=key_to_use,
            provider=provider
        )
        
        # Log to database
        log_id = log_analysis(
            module="freshness",
            input_title=result.get("item_detected", file.filename or "Perishable Scan"),
            result_dict=result,
            score=float(result.get("freshness_index_percent", 80.0)),
            status=result.get("freshness_stage", "Fresh")
        )
        result["db_id"] = log_id
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Freshness diagnostic failed: {str(e)}")
