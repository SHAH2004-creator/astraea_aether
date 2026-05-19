# AETHER — Autonomous Emergency Threat & Hazard Evaluation Responder

> AI-powered multi-agent emergency response command center for real-time urban crisis management.

---

## 🚀 Project Overview

AETHER is a real-time intelligent dashboard that continuously monitors live data streams — infrastructure grid sensors, social media signals, and weather conditions — and fuses them into a single **Sovereign Stability Index (SSI)**. Two specialized AI agents reason over this fused data to autonomously detect threats, assess risk, and execute emergency protocols.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        AETHER SYSTEM                        │
├──────────────────┬──────────────────┬───────────────────────┤
│   Mock Data      │   FastAPI        │   React Frontend      │
│   Sources        │   Backend        │   Dashboard           │
├──────────────────┼──────────────────┼───────────────────────┤
│ grid_sensor.json │ Background       │ Real-time polling     │
│ social_signals   │ Watcher Loop     │ every 1.5 seconds     │
│ weather_api.json │ SSI Calculator   │ Live metric updates   │
│                  │ Agent Engine     │ Simulation controls   │
└──────────────────┴──────────────────┴───────────────────────┘
```

**Frontend:** React + TypeScript + Tailwind CSS + Vite
**Backend:** Python + FastAPI + Pydantic + Uvicorn

---

## 🤖 Agents Developed

### Agent Ares — Threat Detection
- Monitors infrastructure grid and social signals for contradictions
- Triggers critical alerts when Water Pressure Anomaly coincides with Flood social signal
- Executes grid isolation commands during Siege Mode
- Confidence scoring: 0.97–0.98

### Agent Athena — Strategic Routing
- Monitors SSI threshold breaches (stop-loss at 0.5)
- Executes traffic rerouting decisions autonomously
- Detects Lazarus recovery conditions
- Scales down Siege Mode when field verification clears
- Confidence scoring: 0.92–0.95

### Signal Fusion Engine
Combines all data streams using the SSI formula:

```
SSI = (0.7 × S_infra) + (0.3 × S_social)
```

| Variable | Description |
|---|---|
| `S_infra` | Grid pressure reading / 100 |
| `S_social` | 1.0 = Normal, 0.1 = Flood/Panic/Emergency |

---

## 🔌 APIs Used

| Endpoint | Type | Description |
|---|---|---|
| `GET /state` | Mock | Returns SSI, weather, social signal, siege status |
| `POST /api/override/alert` | Mock | Simulates water burst / social panic |
| `POST /api/override/lazarus` | Mock | Triggers Lazarus recovery protocol |
| `POST /api/traffic/reroute` | Mock | Executes traffic rerouting |
| `POST /api/grid/isolate` | Mock | Executes power grid isolation |
| `GET /api/trace` | Mock | Returns full agent decision trace log |

All APIs are mock/simulated for demonstration purposes using local JSON files.

---

## ⚙️ Integration Details

- **Token Optimization Cache** — skips agent inference when SSI variance < 10%, reducing unnecessary computation
- **Pydantic Validation Layer** — sanitizes all incoming sensor data before processing, handles null values gracefully
- **Antigravity Trace Log** — every agent decision logged to `antigravity_trace.json` with timestamp, confidence score, reasoning, and action taken
- **Lazarus Protocol** — automatic recovery triggered when field verification clears and SSI recovers above 0.5 threshold
- **CORS Middleware** — backend allows all origins for seamless frontend-backend communication
- **Hot Reload** — both frontend (Vite HMR) and backend (uvicorn --reload) support live updates

---

## 🎮 Simulation Flow

1. **Normal State** — SSI 100%, all systems green
2. **Trigger Alert** → Click "Initiate Water Burst" — SSI drops, Siege Mode activates
3. **Watch Agents React** — Traffic reroute + Grid isolation execute automatically
4. **Lazarus Reset** → Click "Deploy Lazarus Reset" — system recovers to normal

---

## 🛠️ Setup & Installation

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8080 --reload
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

Open `http://localhost:3001` in your browser.

---

## 📁 Project Structure

```
Astrae_aether/
├── backend/
│   ├── app.py                  # FastAPI backend + agent engine
│   ├── simulate_run.py         # Standalone simulation script
│   ├── active_state.json       # Live system state
│   ├── requirements.txt
│   └── mock_data/
│       ├── grid_sensor.json    # Infrastructure sensor data
│       ├── social_signals.json # Social media signal data
│       └── weather_api.json    # Weather + SSI data
├── frontend/
│   ├── client/
│   │   └── src/
│   │       ├── pages/Home.tsx          # Main dashboard
│   │       └── components/
│   │           └── AetherComponents.tsx # Design system
│   └── vite.config.ts
└── antigravity_trace.json      # Agent decision log
```

---

## 👥 Team

| Name | Role |
|---|---|
| **Muhammad Abdullah Siddique** | Frontend Developer |
| **Muhammad Abdullah Shah** | Backend Developer / Team Lead |

---

## 🏆 Built For

ASTRAE Hackathon — May 2026
