import httpx
from app.core.config import settings


async def send_sms(phone: str, message: str) -> bool:
    """Send SMS via Africa's Talking gateway."""
    if not settings.AFRICASTALKING_KEY:
        print(f"[SMS MOCK] To {phone}: {message}")
        return True
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.africastalking.com/version1/messaging",
            headers={
                "apiKey": settings.AFRICASTALKING_KEY,
                "Accept": "application/json",
            },
            data={
                "username": settings.AFRICASTALKING_USERNAME,
                "to": phone,
                "message": message,
                "from": "TenaLink",
            },
        )
        return resp.status_code == 201


def build_appointment_reminder(patient_name: str, date: str, facility: str) -> str:
    return (
        f"TenaLink: Dear {patient_name}, you have an appointment on {date} "
        f"at {facility}. Reply CONFIRM or CANCEL. "
        f"Dial *123# for more info."
    )


def build_wellness_nudge(patient_name: str, risk_level: str, action: str) -> str:
    return (
        f"TenaLink: Dear {patient_name}, your wellness needs attention ({risk_level} risk). "
        f"Action: {action}. Dial *123# or visit your nearest health center."
    )
