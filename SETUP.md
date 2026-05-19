# AETHER Setup Guide

## Quick Start (5 minutes)

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8080 --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8080
INFO:     Application startup complete
```

### 2. Start the Frontend (in a new terminal)

```bash
cd frontend
pnpm install
pnpm dev
```

**Expected output:**
```
  VITE v7.1.7  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

### 3. Open Browser

Navigate to `http://localhost:3000` and you should see the AETHER dashboard.

## Verify Integration

1. **Check Backend Connection**: The dashboard should show "Backend Online" (no warning banner)
2. **Test Simulation Controls**: Click the colored buttons in the "Simulation Controls" section
3. **Monitor Real-time Updates**: The SSI and status metrics should update every 1.5 seconds

## Project Structure

```
astraea_aether/
├── frontend/          # React + Vite frontend (port 3000)
├── backend/           # FastAPI backend (port 8080)
├── README.md          # Full documentation
└── SETUP.md          # This file
```

## Common Issues

### Issue: "Backend Offline" warning on dashboard
**Solution**: Ensure backend is running on `http://127.0.0.1:8080`

### Issue: Frontend won't start
**Solution**: 
```bash
cd frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Issue: Simulation buttons don't work
**Solution**: Check browser console for errors. Backend must be running and accessible.

## Development Workflow

### Making Changes to Frontend
- Edit files in `frontend/client/src/`
- Changes auto-reload at `http://localhost:3000`
- No restart needed

### Making Changes to Backend
- Edit `backend/app.py`
- Backend auto-reloads with `--reload` flag
- Changes take effect immediately

### Testing Simulation Scenarios
1. Click simulation buttons in the dashboard
2. Watch SSI and status metrics change in real-time
3. Check backend console for trace logs

## Production Deployment

### Frontend
```bash
cd frontend
pnpm build
pnpm start
```

### Backend
```bash
cd backend
uvicorn app:app --host 0.0.0.0 --port 8080
```

## Next Steps

- Read `README.md` for detailed architecture
- Read `SUBMISSION_BRIEF.md` for design philosophy
- Explore `backend/app.py` for backend logic
- Explore `frontend/client/src/pages/Home.tsx` for frontend logic

## Architecture at a Glance

```
┌─────────────────────────────────────────┐
│         Frontend (React)                 │
│     http://localhost:3000               │
│                                         │
│  - Dashboard with real-time metrics    │
│  - Simulation controls                 │
│  - Agent status display                │
└────────────┬────────────────────────────┘
             │ HTTP Polling (1.5s)
             │ GET /state
             │ POST /api/override/*
             ↓
┌─────────────────────────────────────────┐
│    Backend (FastAPI)                    │
│  http://127.0.0.1:8080                 │
│                                         │
│  - Signal Fusion engine                │
│  - SSI calculation                     │
│  - Background watcher                  │
│  - Resilience protocols                │
└─────────────────────────────────────────┘
```

## Key Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/state` | Get current system state |
| POST | `/api/traffic/reroute` | Trigger traffic rerouting |
| POST | `/api/grid/isolate` | Trigger grid isolation |
| POST | `/api/override/alert` | Simulate emergency alert |
| POST | `/api/override/lazarus` | Trigger Lazarus recovery |
| GET | `/api/trace` | Get execution trace logs |

## Support

For detailed information, see:
- `README.md` - Full project documentation
- `SUBMISSION_BRIEF.md` - Architecture and design philosophy
- `backend/app.py` - Backend implementation
- `frontend/client/src/pages/Home.tsx` - Frontend implementation
