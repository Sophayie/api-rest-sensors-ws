import RPi.GPIO as GPIO
import time
import yaml
from client import send_measurement
from gpio.led import led_on, led_off
from gpio.init import gpio_cleanup

# Charger la configuration
with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

PIR_PIN = config["gpio"]["pir_pin"]
LED_PIN = config["gpio"]["led_motion_pin"]
MOTION_SENSOR_ID = config.get("sensor_ids", {}).get("motion")

def run_motion_detection():
    if not MOTION_SENSOR_ID:
        print("[!] Aucun sensorId pour le capteur de mouvement dans le fichier config.yaml.")
        return

    GPIO.setmode(GPIO.BCM)
    GPIO.setup(PIR_PIN, GPIO.IN)

    print("[?] Détection de mouvement activée. Attente de détection...")

    try:
        while True:
            if GPIO.input(PIR_PIN):
                print("Mouvement détecté.")
                send_measurement(MOTION_SENSOR_ID, 1)
                led_on(LED_PIN)
                time.sleep(5)  # LED allumée 5s
                led_off(LED_PIN)
                time.sleep(10)  # Pause de 10s avant de réactiver la détection
            else:
                time.sleep(0.1)
    except KeyboardInterrupt:
        print("\nInterruption par l'utilisateur.")
    finally:
        gpio_cleanup()

if __name__ == "__main__":
    run_motion_detection()

