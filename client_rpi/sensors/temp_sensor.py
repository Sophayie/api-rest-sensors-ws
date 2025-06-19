import time
import board
import adafruit_dht
import yaml
from client_rpi.client_ws import send_measurement

# Charger config.yaml
with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

TEMP_SENSOR_ID = config.get("sensor_ids", {}).get("temperature")
DHT_PIN = config["gpio"]["temp_pin"]

def run_temperature_loop():
    print("Boucle température démarrée")
    if not TEMP_SENSOR_ID:
        print("[!] Aucun sensorId pour le capteur de température dans config.yaml.")
        return

    dht_device = adafruit_dht.DHT11(getattr(board, f"D{DHT_PIN}"))  # Ex: board.D4

    try:
        while True:
            try:
                temperature = dht_device.temperature
                if temperature is not None:
                    print(f"Température détectée : {temperature}°C")
                    send_measurement(TEMP_SENSOR_ID, temperature)
                else:
                    print("[!] Aucune valeur lue.")
            except RuntimeError as e:
                print("[!] Erreur de lecture :", e)

            time.sleep(20)

    except KeyboardInterrupt:
        print("\nInterruption par l'utilisateur.")
    finally:
        dht_device.exit()

if __name__ == "__main__":
    run_temperature_loop()
