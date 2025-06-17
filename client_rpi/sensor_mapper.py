import yaml

def load_sensor_ids():
    try:
        with open("config.yaml", "r") as f:
            config = yaml.safe_load(f)
        sensor_ids = config.get("sensor_ids", {})
        return sensor_ids
    except Exception as e:
        print(f"[!] Erreur lecture sensor_ids depuis config.yaml : {e}")
        return {}
