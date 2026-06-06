from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from app.core.database import get_db, get_fhir_db
from app.models.db.models import Profile
from app.services.fhir.translator import build_fhir_patient, build_vitals_observation, build_patient_bundle
from app.api.v1.dependencies.auth import get_current_user, require_clinician

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.get("/{patient_id}/fhir-bundle")
async def get_patient_fhir_bundle(
    patient_id: UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    fhir_db=Depends(get_fhir_db),
    current_user: Profile = Depends(get_current_user),
):
    result = await db.execute(select(Profile).where(Profile.id == patient_id))
    patient = result.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    fhir_patient = build_fhir_patient({
        "id": str(patient.id),
        "fayda_id": patient.fayda_id or "",
        "full_name": patient.full_name,
        "phone": patient.phone,
    })

    return build_patient_bundle(fhir_patient, []).model_dump(exclude_none=True)


@router.post("/{patient_id}/observations")
async def ingest_observation(
    patient_id: UUID,
    vitals: dict,
    fhir_db=Depends(get_fhir_db),
    current_user: Profile = Depends(require_clinician()),
):
    observations = build_vitals_observation(str(patient_id), vitals)
    docs = [obs.model_dump(exclude_none=True) | {"subject_id": str(patient_id)} for obs in observations]
    if docs:
        await fhir_db.observations.insert_many(docs)
    return {"inserted": len(docs)}
