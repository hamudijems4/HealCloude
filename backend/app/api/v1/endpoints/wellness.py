from fastapi import APIRouter, Depends, HTTPException
from app.schemas.wellness import WellnessRiskInput, WellnessRiskOutput, ChatRequest, ChatResponse
from app.services.ai.risk_engine import compute_risk_score
from app.services.ai.chatbot import chat_with_tenabot
from app.api.v1.dependencies.auth import get_current_user
from app.models.db.models import Profile

router = APIRouter(prefix="/wellness", tags=["AI Wellness"])


@router.post("/risk-score", response_model=WellnessRiskOutput)
async def get_risk_score(
    payload: WellnessRiskInput,
    current_user: Profile = Depends(get_current_user),
):
    return compute_risk_score(payload)


@router.post("/chat", response_model=ChatResponse)
async def wellness_chat(
    payload: ChatRequest,
    current_user: Profile = Depends(get_current_user),
):
    try:
        return await chat_with_tenabot(payload)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI service unavailable: {str(e)}")
