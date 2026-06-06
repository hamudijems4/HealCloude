from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class WellnessRiskInput(BaseModel):
    patient_id: UUID
    age: int
    missed_appointments: int
    chronic_conditions: List[str]
    last_visit_days_ago: int
    bmi: Optional[float] = None
    has_medication: bool = False


class WellnessRiskOutput(BaseModel):
    patient_id: UUID
    risk_score: float        # 0-100
    risk_level: str          # low, medium, high, critical
    risk_factors: List[str]
    recommended_actions: List[str]
    next_followup_date: Optional[datetime] = None


class ChatMessage(BaseModel):
    role: str  # user | assistant
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    patient_context: Optional[dict] = None


class ChatResponse(BaseModel):
    reply: str
    sources: List[str] = []
