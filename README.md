# CloudHeal 🏥
> Ethiopia's National Health Interoperability & AI Wellness Platform — ALX Wellness Hackathon 2024

## 🎯 Mission

**Connect Ethiopia's fragmented healthcare under one cloud.** Every mother. Every baby. Every clinic.

## 🌟 What CloudHeal Does

- **FHIR Interoperability** — Connects ANY hospital system (EMR, Excel, Paper) without forcing migration
- **Fayda ID Integration** — One national ID = one medical passport across all facilities
- **AI Wellness Engine** — Predicts risks, schedules appointments, sends personalized nudges
- **USSD/SMS Reach** — Works for the farmer in the West AND the banker in the East
- **MoH God-View** — Real-time disease surveillance and outbreak prediction
- **Offline-First** — Rural clinics work without internet, auto-sync when connected

## 🎯 Target Users

| User | Value |
|------|-------|
| **Mothers (Almaz)** | Prenatal reminders, unified health history, FREE |
| **Clinicians (Dr. Kebede)** | Instant access to patient history from all facilities |
| **MoH (Tigist)** | Real-time national health surveillance & outbreak alerts |

## 💰 Revenue Model

```
🏛️ Government  → MoH dashboard subscription + data licensing
🌍 NGOs        → Research data access + regional health reports
🏥 Hospitals   → API integration fees
👩🍼 Patients   → FREE. ALWAYS.
```

## 🏗️ Architecture

```
cloudheal/
├── backend/                  # FastAPI (Python 3.12)
│   └── app/
│       ├── api/v1/           # Route handlers
│       │   ├── endpoints/    # auth, wellness, patients, moh
│       │   └── dependencies/ # JWT auth guards
│       ├── core/             # config, security, database
│       ├── models/
│       │   ├── db/           # SQLAlchemy ORM (PostgreSQL)
│       │   └── fhir/         # HL7 FHIR Pydantic resources
│       ├── schemas/          # Request/response schemas
│       ├── services/
│       │   ├── ai/           # Risk engine + HealthBot LLM
│       │   ├── fhir/         # FHIR translator
│       │   └── notifications/# SMS/USSD via Africa's Talking
│       └── middleware/       # Logging, correlation IDs
├── frontend/                 # React + Vite + TypeScript
│   └── src/
│       ├── features/
│       │   ├── landing/      # Stunning animated landing page
│       │   ├── auth/         # Login with Fayda ID
│       │   ├── dashboard/    # MoH "God-View" dashboard
│       │   └── patient/      # Patient portal + HealthBot chat
│       ├── router/           # React Router setup
│       └── App.tsx
├── infra/docker/             # Dockerfiles
├── scripts/                  # Mock data generator
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.12+
- Supabase account (or Docker for local)

### 1. Clone & Configure
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your Supabase credentials
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Start Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 📍 URLs
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API Docs | http://localhost:8000/api/docs |
| Landing | http://localhost:5173/ |
| MoH Dashboard | http://localhost:5173/dashboard |

## 🔑 Demo Credentials
| Role | Identifier | Password |
|------|-----------|----------|
| MoH Analyst | moh@cloudheal.et | password123 |
| Patient | ET8823710293 | password123 |
| Clinician | clinic@cloudheal.et | password123 |

## 🔌 Key APIs
```
POST /api/v1/auth/login          — Login (Fayda ID / email / phone)
POST /api/v1/wellness/risk-score — AI wellness risk prediction
POST /api/v1/wellness/chat       — HealthBot AI chat
GET  /api/v1/moh/summary         — National health summary
GET  /api/v1/moh/regional-stats  — Per-region wellness stats
GET  /api/v1/moh/disease-alerts  — Active outbreak alerts
GET  /api/v1/patients/{id}/fhir-bundle — FHIR patient bundle
```

## 🛠️ Tech Stack
- **Backend**: FastAPI, SQLAlchemy 2 (async), Pydantic v2
- **AI**: Rule-based risk engine + Ollama/Llama3 chatbot
- **Frontend**: React 19, TypeScript, Vite, Recharts, Lucide Icons
- **Auth**: Supabase Auth + Fayda ID integration ready
- **Databases**: PostgreSQL (Supabase) + MongoDB (FHIR resources)
- **Notifications**: Africa's Talking (SMS/USSD)

## 📊 Focus: Maternal & Infant Health

CloudHeal's primary mission is to **reduce infant mortality** in Ethiopia through:
- ✅ AI-powered prenatal visit reminders via USSD
- ✅ Unified health records for mothers across all clinics
- ✅ Real-time maternal risk zone mapping for MoH
- ✅ NGO-funded intervention targeting

---

**One Fayda ID. One History. One Cloud.**

Built with ❤️ for Ethiopia's mothers and babies.
