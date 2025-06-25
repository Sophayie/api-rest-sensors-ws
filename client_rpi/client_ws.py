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

LED_HUMIDITY_PIN = config["gpio"]["led_humidity_pin"]
HUMIDITY_SENSOR_ID = config["sensor_ids"].get("humidity")
HUMIDITY_THRESHOLD = config["thresholds"]["humidity"]

ws = None
is_connected = False

def on_message(ws, message):
    print("Commande reçue :", message)
    try:
        data = json.loads(message)
        sensor_id = data.get("sensorId")
        value = data.get("value")

        if sensor_id == LED_SENSOR_ID:
            if value in ["on", "1", 1]: 
                led_on(LED_CONTROL_PIN)
                print("LED allumée")
                send_measurement(LED_SENSOR_ID, 1)
            elif value in ["off", "0", 0]: 
                led_off(LED_CONTROL_PIN)
                print("LED éteinte")
                send_measurement(LED_SENSOR_ID, 0)                
            else:
                print("[!] Commande inconnue :", data.get("value"))
        
        elif sensor_id == HUMIDITY_SENSOR_ID:
            humidity = int(value)
            print(f"Commande d'humidité reçue : {humidity}%")
            if humidity > HUMIDITY_THRESHOLD:
                print("[!] Seuil dépassé. LED activée")
                led_on(LED_HUMIDITY_PIN)
            else:
                led_off(LED_HUMIDITY_PIN)
            
            send_measurement(HUMIDITY_SENSOR_ID, humidity)

        else:
            print("[!] Ignorée : sensorId ≠ LED")

    except Exception as e:
        print("[!] Erreur message WebSocket :", e)

def on_open(ws):
    global is_connected
    is_connected = True
    print("[✓] Connexion WebSocket établie")
    ws.send(json.dumps({"deviceId": DEVICE_ID}))

def on_close(ws, code, reason):
    global is_connected
    is_connected = False
    print("[-] Connexion WebSocket fermée :", reason)

def on_error(ws, error):
    global is_connected
    is_connected = False
    print("[!] Erreur WebSocket :", error)

def start_websocket():
    global ws
    ws = websocket.WebSocketApp(
        WS_URL,
        on_open=on_open,
        on_message=on_message,
        on_close=on_close,
        on_error=on_error
    )
    ws.run_forever()

def send_measurement(sensor_id, value):
    global ws, is_connected
    if ws and is_connected:
        payload = {
            "deviceId": DEVICE_ID,
            "sensorId": sensor_id,
            "value": value,
            "takenAt": datetime.utcnow().isoformat()
        }
        try: 
            ws.send(json.dumps(payload))
            print("[↑] Mesure envoyée :", payload)
        except Exception as e:
            print("[!] Erreur lors de l'envoi : ", e)
    else:
        print("[!] WebSocket non connecté")
