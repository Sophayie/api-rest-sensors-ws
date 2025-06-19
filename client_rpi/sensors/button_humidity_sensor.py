import RPi.GPIO as GPIO
import time
import yaml
import random
from client_ws import send_measurement
from gpio.led import led_on, led_off
from gpio.init import gpio_cleanup

# Charger la config YAML
with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

BUTTON_PIN = config["gpio"]["button_pin"]
LED_HUMIDITY_PIN = config["gpio"]["led_humidity_pin"]
HUMIDITY_SENSOR_ID = config.get("sensor_ids", {}).get("humidity")

def run_button_humidity_sensor():
    if not HUMIDITY_SENSOR_ID:
        print("[!] Aucun sensorId pour le capteur d'humidité dans config.yaml.")
        return

    print("[?] Attente d'appui sur le bouton...")

    try:
        while True:
            if GPIO.input(BUTTON_PIN) == GPIO.HIGH:
                humidity = random.randint(30, 60)
                print(f"Bouton pressé.Humidité simulée : {humidity}%")
                send_measurement(HUMIDITY_SENSOR_ID, humidity)

                if humidity > config["thresholds"]["humidity"]:
                    print("[!] Seuil dépassé. LED activée")
                    led_on(LED_HUMIDITY_PIN)
                    time.sleep(5)
                    led_off(LED_HUMIDITY_PIN)

                # Attente pour éviter lecture multiple d'un seul appui
                time.sleep(1)
            time.sleep(0.1)
            
    except KeyboardInterrupt:
        print("\nInterruption par l'utilisateur.")
    finally:
        gpio_cleanup()

if __name__ == "__main__":
    run_button_humidity_sensor()
