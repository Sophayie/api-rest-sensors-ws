import websocket
import yaml
import json
from datetime import datetime
from gpio.led import led_on, led_off

# Charger config
with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

DEVICE_ID = config["device_id"]
WS_URL = config["ws_url"]
LED_CONTROL_PIN = config["gpio"]["led_control_pin"]
LED_SENSOR_ID = config["sensor_ids"].get("led")

ws = None

def on_message(ws, message):
    print("[⮞] Commande reçue :", message)
    try:
        data = json.loads(message)

        if data.get("sensorId") == LED_SENSOR_ID:
            if data.get("value") in ["on", "1", 1]: 
                led_on(LED_CONTROL_PIN)
                send_measurement(LED_SENSOR_ID, 1)
            elif data.get("value") in ["off", "0", 0]: 
                led_off(LED_CONTROL_PIN)
                send_measurement(LED_SENSOR_ID, 0)                
            else:
                print("[!] Commande inconnue :", data.get("value"))
        else:
            print("[!] Ignorée : sensorId ≠ LED")

    except Exception as e:
        print("[!] Erreur message WebSocket :", e)

def on_open(ws):
    print("[✓] Connexion WebSocket établie")
    ws.send(json.dumps({"deviceId": DEVICE_ID}))

def start_websocket():
    global ws
    ws = websocket.WebSocketApp(
        WS_URL,
        on_open=on_open,
        on_message=on_message
    )
    ws.run_forever()

def send_measurement(sensor_id, value):
    if ws:
        payload = {
            "deviceId": DEVICE_ID,
            "sensorId": sensor_id,
            "value": value,
            "takenAt": datetime.utcnow().isoformat()
        }
        ws.send(json.dumps(payload))
        print("[↑] Mesure envoyée :", payload)
    else:
        print("[!] WebSocket non connecté")
