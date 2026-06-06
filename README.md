# TenaLink 🏥
> Ethiopia's National Health Interoperability & AI Wellness Platform — ALX Wellness Hackathon 2024

## Architecture

```
tenalink/
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
│       │   ├── ai/           # Risk engine + TenaBot LLM
│       │   ├── fhir/         # FHIR translator
│       │   └── notifications/# SMS/USSD via Africa's Talking
│       └── middleware/       # Logging, correlation IDs
├── frontend/                 # Next.js 14 + Tailwind
│   └── src/
│       ├── app/              # App Router pages
│       │   ├── auth/login/   # Fayda ID / email / phone login
│       │   ├── dashboard/    # MoH "God-View" dashboard
│       │   └── patient/      # Patient portal + TenaBot chat
│       ├── components/
│       │   ├── charts/       # Recharts trend charts
│       │   ├── maps/         # Leaflet wellness heatmap
│       │   └── shared/       # Sidebar, layout
│       ├── hooks/            # React Query hooks
│       ├── store/            # Zustand auth store
│       └── types/            # Shared TypeScript types
├── infra/docker/             # Dockerfiles
├── scripts/                  # Mock data generator
└── docker-compose.yml
```

## Quick Start

### Prerequisites
- Docker + Docker Compose
- Node.js 20+, Python 3.12+

### 1. Clone & configure
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your secrets
```

### 2. Start with Docker
```bash
docker-compose up --build
```

### 3. Local dev (no Docker)
```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 4. Generate mock data
```bash
cd scripts
python generate_mock_data.py
```

## URLs
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API Docs | http://localhost:8000/api/docs |
| MoH Dashboard | http://localhost:3000/dashboard |
| Patient Portal | http://localhost:3000/patient |

## Demo Credentials
| Role | Identifier | Password |
|------|-----------|----------|
| MoH Analyst | moh@tenalink.et | password123 |
| Patient | ET8823710293 | password123 |
| Clinician | clinic@tenalink.et | password123 |

## Key APIs
```
POST /api/v1/auth/login          — Login (Fayda ID / email / phone)
POST /api/v1/wellness/risk-score — AI wellness risk prediction
POST /api/v1/wellness/chat       — TenaBot AI chat
GET  /api/v1/moh/summary         — National health summary
GET  /api/v1/moh/regional-stats  — Per-region wellness stats
GET  /api/v1/moh/disease-alerts  — Active outbreak alerts
GET  /api/v1/patients/{id}/fhir-bundle — FHIR patient bundle
```

## Tech Stack
- **Backend**: FastAPI, SQLAlchemy 2 (async), Motor (MongoDB), Pydantic v2
- **AI**: Rule-based risk engine + Ollama/Llama3 chatbot
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn patterns, Recharts, React-Leaflet
- **State**: Zustand + TanStack Query
- **Auth**: JWT (HS256) + Fayda ID integration ready
- **Databases**: PostgreSQL (relational) + MongoDB (FHIR resources)
- **Notifications**: Africa's Talking (SMS/USSD fallback)
- **Infra**: Docker Compose, ready for AWS ECS / Railway
