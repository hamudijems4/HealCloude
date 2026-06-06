from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid


class FHIRCoding(BaseModel):
    system: str
    code: str
    display: Optional[str] = None


class FHIRCodeableConcept(BaseModel):
    coding: List[FHIRCoding]
    text: Optional[str] = None


class FHIRIdentifier(BaseModel):
    system: str
    value: str


class FHIRReference(BaseModel):
    reference: str
    display: Optional[str] = None


class FHIRPatient(BaseModel):
    resourceType: str = "Patient"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    identifier: List[FHIRIdentifier] = []
    name: List[dict] = []
    gender: Optional[str] = None
    birthDate: Optional[str] = None
    address: Optional[List[dict]] = None
    telecom: Optional[List[dict]] = None
    meta: Optional[dict] = None


class FHIRObservation(BaseModel):
    resourceType: str = "Observation"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "final"
    category: Optional[List[FHIRCodeableConcept]] = None
    code: FHIRCodeableConcept
    subject: FHIRReference
    effectiveDateTime: Optional[str] = None
    valueQuantity: Optional[dict] = None
    valueString: Optional[str] = None
    component: Optional[List[dict]] = None


class FHIRBundle(BaseModel):
    resourceType: str = "Bundle"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str = "searchset"
    total: int = 0
    entry: List[dict] = []
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
