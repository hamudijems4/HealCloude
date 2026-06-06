from datetime import datetime
from app.models.fhir.resources import FHIRPatient, FHIRObservation, FHIRBundle, FHIRIdentifier, FHIRCodeableConcept, FHIRCoding, FHIRReference


FAYDA_SYSTEM = "https://fayda.et/id"
LOINC_SYSTEM = "http://loinc.org"
SNOMED_SYSTEM = "http://snomed.info/sct"


def build_fhir_patient(raw: dict) -> FHIRPatient:
    identifiers = [FHIRIdentifier(system=FAYDA_SYSTEM, value=raw["fayda_id"])]
    if raw.get("mrn"):
        identifiers.append(FHIRIdentifier(system=f"urn:facility:{raw.get('facility_id', 'unknown')}", value=raw["mrn"]))
    return FHIRPatient(
        id=raw.get("id", ""),
        identifier=identifiers,
        name=[{"use": "official", "text": raw.get("full_name", "")}],
        gender=raw.get("gender"),
        birthDate=raw.get("birth_date"),
        telecom=[{"system": "phone", "value": raw["phone"]}] if raw.get("phone") else None,
        address=[{"text": raw.get("address"), "country": "ET"}] if raw.get("address") else None,
    )


def build_vitals_observation(patient_id: str, vitals: dict) -> list[FHIRObservation]:
    observations = []
    vital_codes = {
        "blood_pressure_systolic": ("8480-6", "Systolic blood pressure", "mm[Hg]"),
        "blood_pressure_diastolic": ("8462-4", "Diastolic blood pressure", "mm[Hg]"),
        "heart_rate": ("8867-4", "Heart rate", "/min"),
        "temperature": ("8310-5", "Body temperature", "Cel"),
        "weight": ("29463-7", "Body weight", "kg"),
        "height": ("8302-2", "Body height", "cm"),
    }
    for key, (code, display, unit) in vital_codes.items():
        if key in vitals:
            obs = FHIRObservation(
                code=FHIRCodeableConcept(
                    coding=[FHIRCoding(system=LOINC_SYSTEM, code=code, display=display)],
                    text=display,
                ),
                subject=FHIRReference(reference=f"Patient/{patient_id}"),
                effectiveDateTime=datetime.utcnow().isoformat(),
                valueQuantity={"value": vitals[key], "unit": unit, "system": "http://unitsofmeasure.org"},
            )
            observations.append(obs)
    return observations


def build_patient_bundle(patient: FHIRPatient, observations: list[FHIRObservation]) -> FHIRBundle:
    entries = [{"resource": patient.model_dump(exclude_none=True)}]
    entries += [{"resource": obs.model_dump(exclude_none=True)} for obs in observations]
    return FHIRBundle(total=len(entries), entry=entries)
