from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class FacilityCreate(BaseModel):
    name: str
    type: str
    region: str
    zone: Optional[str] = None
    woreda: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    fhir_endpoint: Optional[str] = None


class FacilityRead(BaseModel):
    id: UUID
    name: str
    type: str
    region: str
    zone: Optional[str]
    woreda: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    is_online: bool

    model_config = {"from_attributes": True}


class AppointmentCreate(BaseModel):
    patient_id: UUID
    facility_id: UUID
    scheduled_at: datetime
    appointment_type: str
    notes: Optional[str] = None


class AppointmentRead(BaseModel):
    id: UUID
    patient_id: UUID
    facility_id: UUID
    scheduled_at: datetime
    attended: Optional[bool]
    appointment_type: str

    model_config = {"from_attributes": True}


class DiseaseAlert(BaseModel):
    region: str
    zone: Optional[str]
    disease_code: str
    disease_name: str
    case_count: int
    severity: str  # watch | warning | emergency
    reported_at: datetime


class RegionalStats(BaseModel):
    region: str
    total_patients: int
    active_alerts: int
    avg_wellness_score: float
    top_conditions: List[str]
    facility_count: int
    coordinates: List[float]  # [lat, lng]
