import json
import os
import time
import urllib.request
import urllib.parse

MOCK_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "Mock_data")
ACTIVE_STATE_FILE = os.path.join(os.path.dirname(__file__), "active_state.json")

def write_json(filename, data):
    with open(os.path.join(MOCK_DATA_DIR, filename), "w") as f:
        json.dump(data, f, indent=2)

def hit_endpoint(endpoint):
    req = urllib.request.Request(f"http://127.0.0.1:8000{endpoint}", method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            pass
    except Exception as e:
        print(f"Failed to hit {endpoint}: {e}")

print("Starting simulation sequence...")

# 1. NORMAL STATE
print("Setting NORMAL state...")
write_json("weather_api.json", {"ssi": 0.9, "condition": "Clear"})
write_json("social_signals.json", {"signal": "Normal", "field_verification": ""})
write_json("grid_sensor.json", {"anomaly": "None"})
time.sleep(3) # Wait for watcher loop

# 2. ALERT STATE (SSI drop & Contradiction)
print("Setting ALERT state...")
write_json("weather_api.json", {"ssi": 0.4, "condition": "Severe Storm"})
write_json("social_signals.json", {"signal": "Flood", "field_verification": ""})
write_json("grid_sensor.json", {"anomaly": "Water Pressure Anomaly"})
time.sleep(3) # Wait for watcher loop

# 3. SIEGE MODE (ACT)
print("Triggering SIEGE MODE endpoints...")
hit_endpoint("/api/traffic/reroute")
time.sleep(1)
hit_endpoint("/api/grid/isolate")
time.sleep(3)

# 4. LAZARUS RECOVERY (ADAPT)
print("Setting LAZARUS RECOVERY state...")
write_json("weather_api.json", {"ssi": 0.8, "condition": "Storm Clearing"})
write_json("social_signals.json", {
    "signal": "Flood", 
    "field_verification": "CLEAR", 
    "notes": "false alarm retracted by field agents"
})
time.sleep(4) # Wait for watcher loop to adapt

print("Simulation complete.")
