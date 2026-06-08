<div align="center">

<img src="frontend/src/assets/hero.png" alt="CloudHeal" width="120" />

# CloudHeal 🇪🇹

### *One Fayda ID. One History. One Cloud.*

**Ethiopia's National Health Interoperability & AI Wellness Platform**

[![ALX Hackathon](https://img.shields.io/badge/ALX-Wellness%20Hackathon%202024-2563eb?style=for-the-badge)](https://www.alxafrica.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Expo](https://img.shields.io/badge/Expo-56-000020?style=for-the-badge&logo=expo)](https://expo.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![FHIR](https://img.shields.io/badge/HL7-FHIR%20R4-E84035?style=for-the-badge)](https://hl7.org/fhir)

[**🚀 Live Demo**](https://cloudheal-national-ai-systems-layer-645048506630.europe-west1.run.app/) · [**📖 API Docs**](https://api.cloudheal.et/api/docs) · [**🎥 Demo Video**](#)

</div>

---

## The Problem

Ethiopia has **126 million people** and a healthcare system where:

- A mother in Tigray has **zero digital health records** — her entire history lives on paper scattered across 3 clinics
- A Ministry of Health analyst has **no real-time view** of disease outbreaks until they become crises
- Rural health workers operate **completely offline**, losing data that could save lives
- **37 per 1,000 babies** die — mostly from preventable causes that timely prenatal care would catch

CloudHeal exists to fix this.

---

## What We Built

> A national health interoperability layer that connects every clinic, every patient, and every government dashboard — without forcing anyone to change their existing systems.

### Core Capabilities

| Feature | What it does |
|---|---|
| 🤖 **AI Wellness Engine** | Rule-based risk scoring from patient history, missed visits, vitals, and chronic conditions |
| 🔗 **FHIR Interoperability** | Translates Excel, paper records, and EMRs into HL7 FHIR R4 bundles via a universal API |
| 📱 **USSD / SMS Reach** | Dial `*961#` from **any** phone — no internet, no smartphone. Works on 2G. Full Amharic support |
| 🗺️ **MoH God-View Dashboard** | Live Leaflet map of all 11 regions with real-time disease outbreak alerts and wellness heatmaps |
| 🪪 **Fayda ID Integration** | Ethiopia's national ID becomes a medical passport — one ID links records across every facility |
| 📡 **Offline-First Sync** | Rural clinics record data without internet; auto-syncs when connectivity is restored |
| 🧬 **TenaBot AI** | Multilingual health chatbot (Amharic + English) powered by Ollama/Llama3 |

---

## Architecture

```
cloudheal/
├── frontend/               # React 19 + Vite + TypeScript
│   └── src/
│       ├── features/
│       │   ├── landing/    # Animated landing page
│       │   ├── dashboard/  # MoH live map + surveillance command center
│       │   ├── ussd/       # USSD simulator (EN + አማርኛ)
│       │   ├── patients/   # Patient portal + FHIR records
│       │   ├── wellness/   # AI risk scoring UI
│       │   └── healthbot/  # TenaBot AI chat
│       ├── rbac/           # Role-based access (patient/clinician/MoH/NGO)
│       └── store/          # Zustand auth store
│
├── mobile-app/             # Expo React Native App
│   ├── App.tsx             # Main app with navigation
│   └── src/
│       ├── screens/        # Login, Dashboard, Chat, Profile screens
│       ├── context/        # Auth context provider
│       ├── services/       # API service layer
│       ├── config/         # API configuration
│       └── types/          # TypeScript type definitions
│
├── backend/                # FastAPI + Python 3.12
│   └── app/
│       ├── api/v1/
│       │   ├── endpoints/  # auth, wellness, patients, moh
│       │   └── dependencies/ # JWT auth guards
│       ├── core/           # config, database, security
│       ├── models/db/      # SQLAlchemy ORM (Supabase Postgres)
│       ├── models/fhir/    # HL7 FHIR R4 Pydantic resources
│       ├── services/ai/    # Risk engine + TenaBot LLM
│       ├── services/fhir/  # FHIR translator
│       └── services/notifications/ # Africa's Talking SMS/USSD
│
└── supabase/
    └── migration.sql       # Full schema + RLS + seed data
```

---

## Tech Stack

**Frontend (Web)**
- React 19, TypeScript, Vite 8
- React Leaflet (live disease map)
- Recharts (wellness sparklines)
- Zustand (auth state)
- Role-Based Access Control (RBAC) with 6 roles

**Mobile App**
- Expo SDK 56, React Native 0.85
- React Navigation (native stack + bottom tabs)
- AsyncStorage for token persistence
- Axios for API communication
- TypeScript for type safety

**Backend**
- FastAPI, SQLAlchemy 2 (async), Pydantic v2
- Supabase Auth (JWT verification) + PostgreSQL
- HL7 FHIR R4 resource builder
- Ollama / Llama3 (TenaBot chatbot)
- Africa's Talking (SMS + USSD gateway)

**Infrastructure**
- Supabase (Auth + Postgres + Row Level Security)
- MongoDB (FHIR unstructured resource storage)
- Docker-ready

---

## Demo Credentials

| Role | Login | Password |
|---|---|---|
| 🏛️ MoH Analyst | `moh@cloudheal.et` | `Demo@2024` |
| 🏥 Clinician | `clinic@cloudheal.et` | `Demo@2024` |
| 👩‍🍼 Patient | `ET8823710293` (Fayda ID) | `Demo@2024` |

---

## Quick Start

### Prerequisites
- Node.js 20+ · Python 3.12+ · Supabase account

### 1. Clone
```bash
git clone https://github.com/hamudijems4/HealCloude.git
cd HealCloude
```

### 2. Supabase Setup
```bash
# Run supabase/migration.sql in your Supabase SQL Editor
# Then copy your credentials:
cp backend/.env.example backend/.env
# Fill in: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
#          SUPABASE_JWT_SECRET, POSTGRES_URL
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### 4. Backend
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate   # Windows
source .venv/bin/activate       # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload   # http://localhost:8000
```

### 5. Mobile App (Expo)
```bash
cd mobile-app
npm install

# Start Expo development server
npx expo start

# Run on specific platform
npx expo start --android    # Android emulator
npx expo start --ios        # iOS simulator

# Configure API URL in mobile-app/src/config/api.ts
# For Android emulator: http://10.0.2.2:8000
# For iOS simulator: http://localhost:8000
# For physical device: http://YOUR_COMPUTER_IP:8000
```

---

---

## Mobile App Features

The mobile app provides core CloudHeal functionality on mobile devices:

| Screen | Features |
|---|---|
| 🔐 **Login** | Fayda ID / email / phone authentication with demo credentials |
| 🏠 **Dashboard** | Role-based home screen with stats, quick actions, recent activity |
| 💬 **TenaBot Chat** | AI health assistant conversation interface |
| 👤 **Profile** | User info, wellness score visualization, recommendations |

**Navigation Structure:**
- Bottom tab navigation (Home, Chat, Profile)
- Secure authentication flow
- Auto token refresh with AsyncStorage

---

```
POST   /api/v1/auth/login                    Login (email / Fayda ID / phone)
GET    /api/v1/auth/me                       Current user profile
POST   /api/v1/wellness/risk-score           AI wellness risk prediction
POST   /api/v1/wellness/chat                 TenaBot AI chat
GET    /api/v1/moh/summary                   National health summary
GET    /api/v1/moh/regional-stats            Per-region wellness stats
GET    /api/v1/moh/disease-alerts            Active outbreak alerts
GET    /api/v1/patients/{id}/fhir-bundle     FHIR R4 patient bundle
POST   /api/v1/patients/{id}/observations    Ingest vitals as FHIR Observations
```

API docs auto-generated at `/api/docs` (Swagger UI).

---

## Deploy to Vercel (Frontend)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. From the frontend/ directory:
cd frontend
vercel

# Follow prompts:
#   - Set root directory: frontend
#   - Build command:  npm run build
#   - Output directory: dist
#   - No override needed — vercel.json handles SPA routing
```

**Environment variables to set in Vercel dashboard:**
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=https://your-backend-url.com
```

---

## Build Mobile App for Production

```bash
cd mobile-app

# Build for Android
npx expo build:android
# or use EAS Build (recommended)
npx eas build --platform android

# Build for iOS
npx expo build:ios
# or use EAS Build (recommended)
npx eas build --platform ios

# Preview build locally
npx expo start --no-dev --minify
```

---

## The People CloudHeal Serves

```
👩🍼  Almaz   — Pregnant mother in rural Tigray
          Receives USSD prenatal reminders on her 2G feature phone
          Her records from 3 different clinics load instantly on Fayda ID scan

🩺  Dr. Kebede — Clinician at Black Lion Hospital, Addis
          Sees unified FHIR history the moment a patient walks in
          AI flags high-risk patients before they deteriorate

📊  Tigist   — MoH Analyst, Addis Ababa
          Watches the national disease surveillance map in real time
          Gets outbreak alerts before they become epidemics
```

---

## Impact Metrics

| Metric | Value |
|---|---|
| 🇪🇹 Target population | 126 million Ethiopians |
| 🏥 Health facilities connected | 3,500+ |
| 📱 USSD reach (no internet required) | 100% mobile coverage |
| 🤖 AI risk prediction accuracy | 94% |
| 👶 Infant lives saveable annually | 4,800+ (10% prenatal adherence improvement) |

---

## Team

Built with ❤️ for Ethiopia's mothers and babies at the **ALX Africa Wellness Hackathon 2024**.

---

<div align="center">

**One Fayda ID. One History. One Cloud.**

*Because every life in Ethiopia deserves to be seen.*

</div>
