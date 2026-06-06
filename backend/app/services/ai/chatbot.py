import httpx
from app.core.config import settings
from app.schemas.wellness import ChatRequest, ChatResponse

SYSTEM_PROMPT = """You are TenaBot, a compassionate AI health assistant built for Ethiopia's TenaLink platform.
You assist patients with understanding their health records, upcoming appointments, and general wellness advice.
You follow Ethiopian Ministry of Health guidelines and can respond in Amharic or English.
Rules:
- Never diagnose. Always advise consulting a doctor for medical decisions.
- Be concise, warm, and culturally respectful.
- For emergencies, always say: "Please call 907 (Ethiopia emergency) or go to the nearest hospital immediately."
"""


async def chat_with_tenabot(request: ChatRequest) -> ChatResponse:
    context_str = ""
    if request.patient_context:
        context_str = f"\nPatient context: {request.patient_context}\n"

    messages = [{"role": "system", "content": SYSTEM_PROMPT + context_str}]
    messages += [{"role": m.role, "content": m.content} for m in request.messages]

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            f"{settings.OLLAMA_BASE_URL}/api/chat",
            json={"model": settings.OLLAMA_MODEL, "messages": messages, "stream": False},
        )
        response.raise_for_status()
        data = response.json()
        reply = data["message"]["content"]

    return ChatResponse(reply=reply, sources=["Ethiopian MoH Guidelines 2024"])
