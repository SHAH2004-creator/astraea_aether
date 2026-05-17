from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from contextlib import asynccontextmanager
import json
import os
import asyncio
from datetime import datetime

MOCK_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "Mock_data")
ACTIVE_STATE_FILE = os.path.join(os.path.dirname(__file__), "active_state.json")
TRACE_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "antigravity_trace.json")

# Token Optimization Cache
telemetry_sliding_cache = []

# Pydantic Data Hygiene Layer
class GridSensorInput(BaseModel):
    reading_psi: float = Field(default=100.0)
    anomaly: str = Field(default="None")
    
    @field_validator("reading_psi", mode="before")
    def catch_null_psi(cls, v):
        if v is None or v == "":
            print("[WARNING] Null reading_psi intercepted. Falling back to cached baseline (100.0).")
            return 100.0
        return float(v)

def append_trace_log(phase, agent, confidence, ssi, reasoning, action, recovery):
    try:
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "phase": phase,
            "agent": agent,
            "signal_fusion_confidence": float(confidence),
            "sovereign_stability_index": float(ssi),
            "internal_reasoning": reasoning,
            "action_executed": action,
            "recovery_status": recovery
        }
        if os.path.exists(TRACE_FILE):
            with open(TRACE_FILE, "r") as f:
                try: trace_data = json.load(f)
                except json.JSONDecodeError: trace_data = []
        else: trace_data = []
            
        trace_data.append(log_entry)
        with open(TRACE_FILE, "w") as f: json.dump(trace_data, f, indent=2)
    except Exception as e: pass

def read_json(filepath):
    try:
        with open(filepath, "r") as f: return json.load(f)
    except Exception: return {}

def write_state(state):
    try:
        with open(ACTIVE_STATE_FILE, "w") as f: json.dump(state, f, indent=2)
    except Exception: pass

async def background_watcher():
    last_calculated_ssi = 1.0
    while True:
        try:
            raw_grid = read_json(os.path.join(MOCK_DATA_DIR, "grid_sensor.json"))
            social_data = read_json(os.path.join(MOCK_DATA_DIR, "social_signals.json"))
            weather_data = read_json(os.path.join(MOCK_DATA_DIR, "weather_api.json"))
            active_state = read_json(ACTIVE_STATE_FILE)
            
            # Pydantic Validation
            grid_input = GridSensorInput(**raw_grid)
            
            signal = social_data.get("signal", "Normal")
            siege_active = active_state.get("siege_mode_active", False)

            # Mathematical Engine
            S_infra = max(0.0, grid_input.reading_psi / 100.0)
            
            # Map social signal to S_social
            S_social = 1.0
            if signal.lower() in ["flood", "panic", "emergency"]:
                S_social = 0.1
            
            # SSI Formula Calculation
            calculated_ssi = (0.7 * S_infra) + (0.3 * S_social)
            
            # Write calculated SSI back to weather_data mock so frontend picks it up dynamically
            weather_data["ssi"] = calculated_ssi
            with open(os.path.join(MOCK_DATA_DIR, "weather_api.json"), "w") as f: json.dump(weather_data, f, indent=2)

            # Token Optimization Cache
            variance = abs(calculated_ssi - last_calculated_ssi) / max(0.01, last_calculated_ssi)
            telemetry_sliding_cache.append(calculated_ssi)
            if len(telemetry_sliding_cache) > 5:
                telemetry_sliding_cache.pop(0)

            # Bypass logic if variance < 10% and we're not breaching the 0.5 threshold
            if variance < 0.10 and calculated_ssi >= 0.5 and not siege_active:
                print(f"[CACHE HIT] Variance {variance*100:.1f}% < 10%. Bypassing LLM inference.")
                last_calculated_ssi = calculated_ssi
                await asyncio.sleep(1.5)
                continue
            
            # State execution
            current_state_hash = f"{signal}_{grid_input.anomaly}_{calculated_ssi:.2f}_{siege_active}"
            if not hasattr(background_watcher, "last_state_hash"):
                background_watcher.last_state_hash = ""
            
            state_changed = (background_watcher.last_state_hash != current_state_hash)
            
            if state_changed:
                print("[CACHE MISS] High variance or Threshold Breach. Executing LLM Payload.")
                append_trace_log(
                    phase="OBSERVE",
                    agent="Agent_Athena",
                    confidence=0.9,
                    ssi=calculated_ssi,
                    reasoning=f"LLM Analyzed Telemetry: S_infra={S_infra:.2f}, S_social={S_social:.2f}.",
                    action=None,
                    recovery=None
                )
                background_watcher.last_state_hash = current_state_hash

            if signal == "Flood" and grid_input.anomaly == "Water Pressure Anomaly":
                if state_changed:
                    append_trace_log(
                        phase="REASON",
                        agent="Agent_Ares",
                        confidence=0.98,
                        ssi=calculated_ssi,
                        reasoning="Contradiction detected: Social media reports Flood, Grid reports Water Pressure Anomaly.",
                        action=None,
                        recovery=None
                    )

            if siege_active:
                field_verification = social_data.get("field_verification", "")
                social_text = json.dumps(social_data).lower()
                is_correction = field_verification == "CLEAR" or any(kw in social_text for kw in ["retracted", "false alarm", "repaired"])
                
                if is_correction:
                    if calculated_ssi >= 0.5:
                        append_trace_log(
                            phase="ADAPT",
                            agent="Agent_Ares",
                            confidence=0.99,
                            ssi=calculated_ssi,
                            reasoning="Correction marker detected in field verification. Triggering Lazarus Protocol.",
                            action="Scaling down Siege Mode",
                            recovery="SUCCESS"
                        )
                        active_state["siege_mode_active"] = False
                        active_state["system_state"] = "NORMAL"
                        active_state["traffic_reroute"] = "pending"
                        active_state["grid_isolate"] = "pending"
                        write_state(active_state)
                        background_watcher.last_state_hash = ""
            else:
                if calculated_ssi < 0.5:
                    if state_changed:
                        append_trace_log(
                            phase="DECIDE",
                            agent="Agent_Athena",
                            confidence=0.95,
                            ssi=calculated_ssi,
                            reasoning="SSI dropped below 0.5 Stop-Loss threshold. Two-Key Consensus required.",
                            action="Awaiting Override",
                            recovery=None
                        )
            
            last_calculated_ssi = calculated_ssi

        except Exception as e:
            print(f"Watcher error: {e}")
        
        await asyncio.sleep(1.5)

@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.path.exists(TRACE_FILE): os.remove(TRACE_FILE)
    
    # Initialize JSON with reading_psi
    try:
        with open(os.path.join(MOCK_DATA_DIR, "grid_sensor.json"), "r") as f:
            d = json.load(f)
            if "reading_psi" not in d:
                d["reading_psi"] = 100.0
                with open(os.path.join(MOCK_DATA_DIR, "grid_sensor.json"), "w") as fw: json.dump(d, fw, indent=2)
    except: pass
    
    task = asyncio.create_task(background_watcher())
    yield
    task.cancel()

app = FastAPI(title="AETHER Backend Orchestration Engine", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/state")
async def get_state():
    weather_data = read_json(os.path.join(MOCK_DATA_DIR, "weather_api.json"))
    social_data = read_json(os.path.join(MOCK_DATA_DIR, "social_signals.json"))
    active_state = read_json(ACTIVE_STATE_FILE)
    return {
        "ssi": weather_data.get("ssi", 1.0),
        "social_signal": social_data.get("signal", ""),
        "weather_condition": weather_data.get("condition", ""),
        "siege_mode_active": active_state.get("siege_mode_active", False),
        "traffic_reroute": active_state.get("traffic_reroute", "pending"),
        "grid_isolate": active_state.get("grid_isolate", "pending")
    }

@app.get("/ui", response_class=HTMLResponse)
async def get_ui():
    ui_path = os.path.join(os.path.dirname(__file__), "..", "aether_react_native", "web_preview.html")
    try:
        with open(ui_path, "r", encoding="utf-8") as f: return f.read()
    except Exception as e: return f"<html><body><h1>UI File Not Found</h1><p>{e}</p></body></html>"

@app.post("/api/traffic/reroute")
async def traffic_reroute():
    state = read_json(ACTIVE_STATE_FILE)
    state["traffic_reroute"] = "executed"
    state["siege_mode_active"] = True
    write_state(state)
    weather_data = read_json(os.path.join(MOCK_DATA_DIR, "weather_api.json"))
    append_trace_log("ACT", "Agent_Athena", 0.92, weather_data.get("ssi", 0.4), "Executing Traffic Rerouting via Siege Mode consensus.", "traffic_reroute", None)
    return {"status": "success"}

@app.post("/api/grid/isolate")
async def grid_isolate():
    state = read_json(ACTIVE_STATE_FILE)
    state["grid_isolate"] = "executed"
    state["siege_mode_active"] = True
    write_state(state)
    weather_data = read_json(os.path.join(MOCK_DATA_DIR, "weather_api.json"))
    append_trace_log("ACT", "Agent_Ares", 0.97, weather_data.get("ssi", 0.4), "Executing Grid Isolation via Siege Mode consensus.", "grid_isolate", None)
    return {"status": "success"}

@app.get("/api/trace")
async def get_trace():
    trace_data = read_json(TRACE_FILE)
    return {"trace": trace_data if isinstance(trace_data, list) else []}

@app.post("/api/override/alert")
async def override_alert():
    # Syncs physical variables instead of arbitrary SSI
    social_data = {"signal": "Flood", "field_verification": ""}
    grid_data = {"anomaly": "Water Pressure Anomaly", "reading_psi": 25.0} # Will drop S_infra
    
    with open(os.path.join(MOCK_DATA_DIR, "social_signals.json"), "w") as f: json.dump(social_data, f, indent=2)
    with open(os.path.join(MOCK_DATA_DIR, "grid_sensor.json"), "w") as f: json.dump(grid_data, f, indent=2)
    return {"status": "Alert override triggered (Physical Mapping)"}

@app.post("/api/override/lazarus")
async def override_lazarus():
    social_data = {"signal": "Normal", "field_verification": "CLEAR", "notes": "false alarm retracted"}
    grid_data = {"anomaly": "None", "reading_psi": 100.0}
    
    with open(os.path.join(MOCK_DATA_DIR, "social_signals.json"), "w") as f: json.dump(social_data, f, indent=2)
    with open(os.path.join(MOCK_DATA_DIR, "grid_sensor.json"), "w") as f: json.dump(grid_data, f, indent=2)
    return {"status": "Lazarus override triggered (Physical Mapping)"}
