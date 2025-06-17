import requests
import yaml
from datetime import datetime

# Charger la config YAML pour l'URL backend
with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

BACKEND_URL = config.get("backend_url", "http://localhost:3000")
MEASUREMENTS_ENDPOINT = f"{BACKEND_URL}/api/measurements"

def send_measurement(sensor_id, value):
    payload = {
        "sensorId": sensor_id,
        "value": value,
        "takenAt": datetime.utcnow().isoformat()
    }

    try:
        response = requests.post(MEASUREMENTS_ENDPOINT, json=payload)
        response.raise_for_status()
        print(f"[✓] Mesure envoyée : {payload}")
    except requests.exceptions.RequestException as e:
        print(f"[!] Échec de l'envoi de la mesure : {e}")
