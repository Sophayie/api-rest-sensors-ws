import RPi.GPIO as GPIO
import yaml
import os

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
config_path = os.path.join(base_dir, 'config.yaml')

with open(config_path, "r") as f:
    config = yaml.safe_load(f)

def gpio_setup():
    GPIO.setmode(GPIO.BCM)

    GPIO.setup(config["gpio"]["pir_pin"], GPIO.IN)
    GPIO.setup(config["gpio"]["button_pin"], GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

    GPIO.setup(config["gpio"]["led_motion_pin"], GPIO.OUT)
    GPIO.setup(config["gpio"]["led_humidity_pin"], GPIO.OUT)

def gpio_cleanup():
    GPIO.cleanup()
