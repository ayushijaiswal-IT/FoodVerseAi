from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from backend.ai_engine import ai_engine
from backend.database import log_analysis, get_db_connection
from backend.config import settings
import json

router = APIRouter(prefix="/api/hygiene", tags=["Hygiene"])

@router.post("/audit")
async def audit_kitchen_hygiene(
    file: UploadFile = File(...),
    inspection_notes: Optional[str] = Form(""),
    api_key: Optional[str] = Form(""),
    provider: Optional[str] = Form("gemini")
):
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty media file uploaded")
            
        key_to_use = api_key or settings.GEMINI_API_KEY
        result = await ai_engine.analyze_kitchen_hygiene(
            media_bytes=contents,
            inspection_notes=inspection_notes,
            api_key=key_to_use,
            provider=provider
        )
        
        # Log to analysis_history
        log_id = log_analysis(
            module="hygiene",
            input_title=result.get("kitchen_zone", "Kitchen Audit"),
            result_dict=result,
            score=float(result.get("overall_compliance_score", 90.0)),
            status=result.get("compliance_grade", "Grade A")
        )
        
        # Also log to hygiene_audits table
        try:
            conn = get_db_connection()
            c = conn.cursor()
            from datetime import datetime
            c.execute(
                "INSERT INTO hygiene_audits (timestamp, kitchen_area, overall_score, compliance_level, violations_count, audit_details) VALUES (?, ?, ?, ?, ?, ?)",
                (datetime.now().isoformat(), result.get("kitchen_zone"), result.get("overall_compliance_score"), result.get("compliance_grade"), len(result.get("itemized_violations", [])), json.dumps(result))
            )
            conn.commit()
            conn.close()
        except Exception:
            pass
            
        result["db_id"] = log_id
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hygiene audit failed: {str(e)}")
