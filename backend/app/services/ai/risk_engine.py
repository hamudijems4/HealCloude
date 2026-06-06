import numpy as np
from datetime import datetime, timedelta
from app.schemas.wellness import WellnessRiskInput, WellnessRiskOutput


RISK_WEIGHTS = {
    "missed_appointments": 0.30,
    "last_visit_days_ago": 0.25,
    "chronic_conditions": 0.20,
    "age_factor": 0.15,
    "bmi_factor": 0.10,
}

HIGH_RISK_CONDITIONS = {
    "diabetes", "hypertension", "hiv", "tuberculosis",
    "heart_disease", "chronic_kidney_disease", "cancer",
}

ACTION_MAP = {
    "critical": ["Immediate clinical review required", "Alert assigned clinician", "Schedule urgent appointment"],
    "high": ["Schedule follow-up within 7 days", "Send medication reminder", "Nurse triage call"],
    "medium": ["Send wellness check SMS", "Schedule next appointment", "Review medication adherence"],
    "low": ["Routine check-up reminder in 30 days", "Wellness tip notification"],
}


def compute_risk_score(input: WellnessRiskInput) -> WellnessRiskOutput:
    scores = {}
    risk_factors = []

    # Missed appointments (0-100)
    appt_score = min(input.missed_appointments * 20, 100)
    scores["missed_appointments"] = appt_score
    if input.missed_appointments > 0:
        risk_factors.append(f"{input.missed_appointments} missed appointment(s)")

    # Days since last visit (0-100)
    visit_score = min(input.last_visit_days_ago / 3.65, 100)  # 365 days = 100
    scores["last_visit_days_ago"] = visit_score
    if input.last_visit_days_ago > 90:
        risk_factors.append(f"No visit in {input.last_visit_days_ago} days")

    # Chronic conditions
    high_risk_count = sum(1 for c in input.chronic_conditions if c.lower() in HIGH_RISK_CONDITIONS)
    condition_score = min(high_risk_count * 25 + len(input.chronic_conditions) * 10, 100)
    scores["chronic_conditions"] = condition_score
    if input.chronic_conditions:
        risk_factors.append(f"Chronic conditions: {', '.join(input.chronic_conditions)}")

    # Age factor
    age_score = 0
    if input.age > 65:
        age_score = 70
        risk_factors.append("Age > 65 (high-risk demographic)")
    elif input.age > 50:
        age_score = 40
    elif input.age < 5:
        age_score = 50
        risk_factors.append("Age < 5 (pediatric risk)")
    scores["age_factor"] = age_score

    # BMI factor
    bmi_score = 0
    if input.bmi:
        if input.bmi > 30 or input.bmi < 18.5:
            bmi_score = 60
            risk_factors.append(f"BMI {input.bmi:.1f} outside healthy range")
        elif input.bmi > 25:
            bmi_score = 30
    scores["bmi_factor"] = bmi_score

    final_score = sum(scores[k] * RISK_WEIGHTS[k] for k in RISK_WEIGHTS)

    if final_score >= 75:
        risk_level = "critical"
    elif final_score >= 50:
        risk_level = "high"
    elif final_score >= 25:
        risk_level = "medium"
    else:
        risk_level = "low"

    days_to_followup = {"critical": 3, "high": 7, "medium": 30, "low": 90}[risk_level]

    return WellnessRiskOutput(
        patient_id=input.patient_id,
        risk_score=round(final_score, 2),
        risk_level=risk_level,
        risk_factors=risk_factors,
        recommended_actions=ACTION_MAP[risk_level],
        next_followup_date=datetime.utcnow() + timedelta(days=days_to_followup),
    )
