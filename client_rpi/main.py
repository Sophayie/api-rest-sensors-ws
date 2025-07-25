from gpio.init import gpio_setup, gpio_cleanup
from sensors.temp_sensor import run_temperature_loop
from sensors.button_humidity_sensor import run_button_humidity_sensor
from client_ws import start_websocket
import threading
import time

if __name__ == "__main__":
    
    try:
        gpio_setup()
        print("[Démarrage des capteurs et WebSocket...]")

        # Lancer chaque capteur dans un thread séparé
        threading.Thread(target=start_websocket, daemon=True).start()
        threading.Thread(target=run_temperature_loop, daemon=True).start()
        threading.Thread(target=run_button_humidity_sensor, daemon=True).start()

        while True:
            time.sleep(1)
    
    except KeyboardInterrupt :
        print("Interruption clavier détectée")

    finally:
        gpio_cleanup()
        print("Nettoyage propre des GPIO")

