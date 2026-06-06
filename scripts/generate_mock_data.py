import random
import json
from datetime import datetime, timedelta
import uuid

ETHIOPIAN_FIRST_NAMES = [
    "Abebe", "Selam", "Tigist", "Dawit", "Hana", "Yohannes", "Mekdes",
    "Tadesse", "Almaz", "Girma", "Bethlehem", "Samuel", "Frehiwot", "Kebede",
    "Tsehay", "Mulugeta", "Selamawit", "Tesfaye", "Birtukan", "Hailu",
]
ETHIOPIAN_LAST_NAMES = [
    "Haile", "Bekele", "Tadesse", "Worku", "Alemu", "Getachew", "Mekonnen",
    "Tesfaye", "Girma", "Abebe", "Lemma", "Negash", "Desta", "Wolde",
]
REGIONS = ["Addis Ababa", "Oromia", "Amhara", "Tigray", "SNNPR", "Somali", "Afar"]
CONDITIONS = ["Malaria", "Hypertension", "Diabetes", "Tuberculosis", "Pneumonia", "Anemia", "Malnutrition"]
APPOINTMENT_TYPES = ["General Checkup", "Follow-up", "ANC", "Immunization", "HIV/ART", "TB Followup"]


def random_fayda_id():
    return f"ET{random.randint(1000000000, 9999999999)}"


def random_date(start_days_ago=365, end_days_ago=0):
    delta = random.randint(end_days_ago, start_days_ago)
    return (datetime.utcnow() - timedelta(days=delta)).isoformat()


def generate_patients(n=500):
    patients = []
    for _ in range(n):
        fname = random.choice(ETHIOPIAN_FIRST_NAMES)
        lname = random.choice(ETHIOPIAN_LAST_NAMES)
        patients.append({
            "id": str(uuid.uuid4()),
            "fayda_id": random_fayda_id(),
            "full_name": f"{fname} {lname}",
            "gender": random.choice(["male", "female"]),
            "birth_date": random_date(start_days_ago=365 * 60, end_days_ago=365 * 5),
            "phone": f"+2519{random.randint(10000000, 99999999)}",
            "region": random.choice(REGIONS),
            "conditions": random.sample(CONDITIONS, random.randint(0, 3)),
            "missed_appointments": random.randint(0, 5),
            "last_visit_days_ago": random.randint(0, 365),
        })
    return patients


def generate_appointments(patients, n=2000):
    appointments = []
    for _ in range(n):
        patient = random.choice(patients)
        appointments.append({
            "id": str(uuid.uuid4()),
            "patient_id": patient["id"],
            "scheduled_at": random_date(start_days_ago=180),
            "appointment_type": random.choice(APPOINTMENT_TYPES),
            "attended": random.choice([True, True, True, False]),
            "region": patient["region"],
        })
    return appointments


if __name__ == "__main__":
    patients = generate_patients(500)
    appointments = generate_appointments(patients, 2000)

    with open("mock_patients.json", "w") as f:
        json.dump(patients, f, indent=2, default=str)
    with open("mock_appointments.json", "w") as f:
        json.dump(appointments, f, indent=2, default=str)

    print(f"✅ Generated {len(patients)} patients and {len(appointments)} appointments")
