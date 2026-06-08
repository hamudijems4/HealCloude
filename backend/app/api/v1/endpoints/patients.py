from fastapi import APIRouter, Depends, HTTPException, Path, Body, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from uuid import UUID
from typing import Optional
from app.core.database import get_db
from app.models.db.models import Profile, WellnessScore, Appointment
from app.services.fhir.translator import build_fhir_patient, build_vitals_observation, build_patient_bundle
from app.api.v1.dependencies.auth import get_current_user, require_clinician
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/patients", tags=["Patients"])


class PatientListItem(BaseModel):
    id: str
    fayda_id: Optional[str]
    full_name: str
    phone: Optional[str]
    gender: Optional[str]
    region: Optional[str]
    role: str
    risk_level: Optional[str] = None
    risk_score: Optional[float] = None
    model_config = {"from_attributes": True}


@router.get("", response_model=list[PatientListItem])
async def list_patients(
    search: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    risk:   Optional[str] = Query(None),
    limit:  int = Query(50, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_clinician),
):
    q = select(Profile).where(Profile.role == "patient")

    if search:
        term = f"%{search}%"
        q = q.where(or_(
            Profile.full_name.ilike(term),
            Profile.fayda_id.ilike(term),
            Profile.phone.ilike(term),
        ))
    if region:
        q = q.where(Profile.region == region)

    q = q.limit(limit)
    rows = await db.execute(q)
    patients = rows.scalars().all()

    # Attach latest wellness score
    result = []
    for p in patients:
        ws_row = await db.execute(
            select(WellnessScore)
            .where(WellnessScore.patient_id == p.id)
            .order_by(WellnessScore.computed_at.desc())
            .limit(1)
        )
        ws = ws_row.scalar_one_or_none()

        item = PatientListItem(
            id=str(p.id),
            fayda_id=p.fayda_id,
            full_name=p.full_name,
            phone=p.phone,
            gender=p.gender,
            region=p.region,
            role=p.role.value,
            risk_level=ws.risk_level if ws else None,
            risk_score=ws.score if ws else None,
        )
        # filter by risk if requested
        if risk and item.risk_level != risk:
            continue
        result.append(item)

    return result


@router.get("/{patient_id}", response_model=PatientListItem)
async def get_patient(
    patient_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    result = await db.execute(select(Profile).where(Profile.id == patient_id))
    patient = result.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    ws_row = await db.execute(
        select(WellnessScore)
        .where(WellnessScore.patient_id == patient.id)
        .order_by(WellnessScore.computed_at.desc())
        .limit(1)
    )
    ws = ws_row.scalar_one_or_none()

    return PatientListItem(
        id=str(patient.id),
        fayda_id=patient.fayda_id,
        full_name=patient.full_name,
        phone=patient.phone,
        gender=patient.gender,
        region=patient.region,
        role=patient.role.value,
        risk_level=ws.risk_level if ws else None,
        risk_score=ws.score if ws else None,
    )


@router.get("/{patient_id}/fhir-bundle")
async def get_patient_fhir_bundle(
    patient_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    result = await db.execute(select(Profile).where(Profile.id == patient_id))
    patient = result.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    fhir_patient = build_fhir_patient({
        "id":        str(patient.id),
        "fayda_id":  patient.fayda_id or "",
        "full_name": patient.full_name,
        "phone":     patient.phone,
        "gender":    patient.gender,
    })
    return build_patient_bundle(fhir_patient, []).model_dump(exclude_none=True)


@router.post("/{patient_id}/observations")
async def ingest_observation(
    patient_id: UUID,
    vitals: dict = Body(...),
    current_user: Profile = Depends(require_clinician),
):
    observations = build_vitals_observation(str(patient_id), vitals)
    docs = [obs.model_dump(exclude_none=True) | {"subject_id": str(patient_id)} for obs in observations]

    try:
        from app.core.database import get_fhir_db
        fhir_db = get_fhir_db()
        if docs:
            await fhir_db.observations.insert_many(docs)
    except Exception:
        pass

    return {"inserted": len(docs)}


@router.get("/{patient_id}/appointments")
async def get_patient_appointments(
    patient_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    rows = await db.execute(
        select(Appointment)
        .where(Appointment.patient_id == patient_id)
        .order_by(Appointment.scheduled_at.desc())
        .limit(20)
    )
    appts = rows.scalars().all()
    return [
        {
            "id":               str(a.id),
            "scheduled_at":     a.scheduled_at.isoformat(),
            "appointment_type": a.appointment_type,
            "status":           a.status.value,
            "ai_scheduled":     a.ai_scheduled,
            "ussd_notified":    a.ussd_notified,
        }
        for a in appts
    ]
