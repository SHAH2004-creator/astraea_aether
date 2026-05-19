# AETHER: Autonomous Emergency Threat & Hazard Evaluation Responder

## Project Structure

This reorganized project follows a clean separation of concerns with a dedicated frontend, backend, and supporting documentation.

```
astraea_aether/
├── frontend/                  # React + TypeScript + Vite frontend application
│   ├── client/               # Client-side React application
│   │   ├── src/
│   │   │   ├── pages/        # Page components (Home, NotFound)
│   │   │   ├── components/   # Reusable UI components
│   │   │   │   ├── ui/       # Shadcn/ui component library
│   │   │   │   ├── AetherComponents.tsx  # AETHER-specific components
│   │   │   │   └── ...
│   │   │   ├── contexts/     # React contexts (Theme)
│   │   │   ├── hooks/        # Custom React hooks
│   │   │   ├── lib/          # Utilities
│   │   │   ├── App.tsx       # Root component
│   │   │   └── main.tsx      # Entry point
│   │   └── index.html
│   ├── server/               # Express server for production serving
│   │   └── index.ts
│   ├── shared/               # Shared constants
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.ts        # Vite configuration
│   └── tsconfig.json
│
├── backend/                   # FastAPI backend orchestration engine
│   ├── app.py                # Main FastAPI application
│   ├── simulate_run.py       # Simulation utility for testing
│   ├── active_state.json     # Persisted backend state
│   ├── mock_data/            # Mock data for simulation
│   │   ├── grid_sensor.json
│   │   ├── social_signals.json
│   │   └── weather_api.json
│   └── __pycache__/
│
├── SUBMISSION_BRIEF.md        # Project architecture and design documentation
├── antigravity_trace.json     # Execution trace logs
└── README.md                  # This file
```

## Quick Start

### Prerequisites
- **Node.js** 22.13.0+ (for frontend)
- **Python** 3.11+ (for backend)
- **pnpm** (frontend package manager)

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend will start on `http://localhost:3000`

### Backend Setup

```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn app:app --host 127.0.0.1 --port 8080 --reload
```

The backend will start on `http://127.0.0.1:8080`

## Architecture Overview

### Frontend (React + TypeScript + Vite)
- **Framework**: React 19 with TypeScript
- **Styling**: TailwindCSS 4 with Shadcn/ui components
- **Build Tool**: Vite 7
- **Routing**: Wouter (lightweight router)
- **State Management**: React hooks + Context API
- **Features**:
  - Real-time dashboard with threat indicators
  - System status monitoring
  - Urban sector analysis
  - Infrastructure health tracking
  - Agent status display
  - Simulation controls for testing

### Backend (FastAPI + Python)
- **Framework**: FastAPI with async/await support
- **Core Features**:
  - **Signal Fusion**: Analyzes contradictory signals from multiple sources
  - **Sovereign Stability Index (SSI)**: Calculates system stability (0.0-1.0)
  - **Background Watcher**: Continuous monitoring with 1.5s polling
  - **Resilience Matrix**: Multi-tiered fail-safe protocols
  - **Lazarus Protocol**: Automatic recovery mechanism
- **Endpoints**:
  - `GET /state` - Current system state
  - `POST /api/traffic/reroute` - Trigger traffic rerouting
  - `POST /api/grid/isolate` - Trigger grid isolation
  - `POST /api/override/alert` - Simulate emergency alert
  - `POST /api/override/lazarus` - Trigger Lazarus recovery
  - `GET /api/trace` - Retrieve execution trace logs

## Key Concepts

### Sovereign Stability Index (SSI)
The SSI is calculated as:
```
SSI = (0.7 × S_infra) + (0.3 × S_social)
```
- **S_infra**: Infrastructure health (grid pressure normalized)
- **S_social**: Social signal stability
- **Threshold**: SSI < 0.5 triggers enhanced monitoring

### Dual-Agent Architecture
- **Agent Ares**: Threat Detection & Containment
- **Agent Athena**: Strategic Routing & Logistics

### Resilience Protocols
1. **Stop-Loss Limit**: SSI < 0.5 triggers heightened alert
2. **Two-Key Consensus**: Both agents must validate critical actions
3. **Lazarus Protocol**: Automatic recovery when false alarms are retracted

## Frontend-Backend Integration

The frontend connects to the backend via HTTP:
- **Backend URL**: `http://127.0.0.1:8080`
- **Polling Interval**: 1.5 seconds
- **CORS**: Enabled for all origins

### Simulation Controls
- **🔴 Initiate Water Burst**: Simulates infrastructure failure
- **🟡 Trigger Social Panic**: Simulates social signal anomaly
- **💚 Deploy Lazarus Reset**: Triggers recovery protocol

## Development

### Frontend Development
```bash
cd frontend
pnpm dev          # Start dev server with hot reload
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm check        # Type check
pnpm format       # Format code
```

### Backend Development
```bash
cd backend
# Run with auto-reload
uvicorn app:app --host 127.0.0.1 --port 8080 --reload

# Or use the simulation utility
python simulate_run.py
```

## File Organization

### Removed Redundant Code
The following redundant frontends have been removed:
- `.agents/aether_react_native/` - React Native mobile app
- `.agents/aether_cmd_deck/` - Flutter mobile dashboard
- `.agents/public/` - Old public assets
- All duplicate UI code from the agent folder

### Single Source of Truth
- **Frontend**: `frontend/` folder only
- **Backend**: `backend/` folder only
- **Configuration**: Centralized in respective `package.json` and `vite.config.ts`

## API Contract

### GET /state
Returns current system state:
```json
{
  "ssi": 0.75,
  "social_signal": "Normal",
  "weather_condition": "Clear",
  "siege_mode_active": false,
  "traffic_reroute": "pending",
  "grid_isolate": "pending"
}
```

### POST /api/override/alert
Triggers an emergency alert scenario:
```json
{
  "status": "Alert override triggered (Physical Mapping)"
}
```

### POST /api/override/lazarus
Triggers recovery protocol:
```json
{
  "status": "Lazarus override triggered (Physical Mapping)"
}
```

## Deployment

### Production Build (Frontend)
```bash
cd frontend
pnpm build
pnpm start
```

### Production Deployment (Backend)
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8080
```

## Troubleshooting

### Frontend can't connect to backend
- Ensure backend is running on `http://127.0.0.1:8080`
- Check CORS is enabled in backend (it is by default)
- Verify no firewall is blocking port 8080

### Backend mock data not updating
- Check `backend/mock_data/` files have proper JSON format
- Verify `backend/active_state.json` exists and is writable
- Check console for watcher errors

### Simulation controls not working
- Verify backend is running
- Check browser console for fetch errors
- Ensure backend endpoints are accessible

## Documentation

- **SUBMISSION_BRIEF.md**: Detailed architecture, algorithms, and design philosophy
- **antigravity_trace.json**: Execution trace logs for debugging

## License

MIT

## Support

For issues or questions about the AETHER system, refer to the SUBMISSION_BRIEF.md for detailed architecture documentation.
