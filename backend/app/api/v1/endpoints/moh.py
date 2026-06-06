from fastapi import APIRouter, Depends
from typing import List
from app.schemas.health import RegionalStats, DiseaseAlert
from app.api.v1.dependencies.auth import require_moh
from app.models.db.models import Profile
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/moh", tags=["Ministry of Health"])

ETHIOPIA_REGIONS = [
    {"name": "Addis Ababa", "coords": [9.0054, 38.7636]},
    {"name": "Oromia", "coords": [8.0, 38.5]},
    {"name": "Amhara", "coords": [11.0, 37.5]},
    {"name": "Tigray", "coords": [14.0, 38.5]},
    {"name": "SNNPR", "coords": [6.5, 37.0]},
    {"name": "Somali", "coords": [7.0, 44.0]},
    {"name": "Afar", "coords": [12.0, 41.0]},
    {"name": "Benishangul-Gumuz", "coords": [10.5, 35.5]},
    {"name": "Gambela", "coords": [8.0, 34.5]},
    {"name": "Harari", "coords": [9.31, 42.12]},
    {"name": "Dire Dawa", "coords": [9.6, 41.85]},
]

COMMON_CONDITIONS = [
    "Malaria", "Tuberculosis", "Pneumonia", "Diarrhea",
    "Hypertension", "Diabetes", "Malnutrition", "HIV/AIDS"
]


@router.get("/regional-stats", response_model=List[RegionalStats])
async def get_regional_stats(current_user: Profile = Depends(require_moh)):
    return [
        RegionalStats(
            region=r["name"],
            total_patients=random.randint(5000, 500000),
            active_alerts=random.randint(0, 5),
            avg_wellness_score=round(random.uniform(45, 85), 1),
            top_conditions=random.sample(COMMON_CONDITIONS, 3),
            facility_count=random.randint(10, 200),
            coordinates=r["coords"],
        )
        for r in ETHIOPIA_REGIONS
    ]


@router.get("/disease-alerts", response_model=List[DiseaseAlert])
async def get_disease_alerts(current_user: Profile = Depends(require_moh)):
    return [
        DiseaseAlert(
            region="Oromia", zone="East Hararghe", disease_code="A09",
            disease_name="Diarrhea", case_count=342, severity="warning",
            reported_at=datetime.utcnow() - timedelta(hours=6),
        ),
        DiseaseAlert(
            region="Afar", zone="Zone 1", disease_code="B54",
            disease_name="Malaria", case_count=89, severity="watch",
            reported_at=datetime.utcnow() - timedelta(hours=12),
        ),
        DiseaseAlert(
            region="Tigray", zone="South Tigray", disease_code="A15",
            disease_name="Tuberculosis", case_count=27, severity="emergency",
            reported_at=datetime.utcnow() - timedelta(hours=2),
        ),
    ]


@router.get("/summary")
async def get_national_summary(current_user: Profile = Depends(require_moh)):
    return {
        "total_registered_patients": 2_847_391,
        "facilities_online": 1_204,
        "facilities_offline": 87,
        "active_alerts": 3,
        "avg_national_wellness_score": 62.4,
        "ai_interventions_today": 14_823,
        "ussd_sessions_today": 3_421,
        "last_updated": datetime.utcnow().isoformat(),
    }
