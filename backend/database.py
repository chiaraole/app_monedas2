# backend/database.py
import json
import os
from typing import Dict
from utils import hash_password

USERS_FILE = "users.json"
HISTORY_FILE = "history.json"

# ------------------- CARGAR -------------------
def load_json(file):
    if os.path.exists(file):
        with open(file, "r") as f:
            return json.load(f)
    return {}

USERS: Dict[str, dict] = load_json(USERS_FILE)
HISTORY: Dict[str, list] = load_json(HISTORY_FILE)

# Inicializa con usuarios X e Y si aún no existen
if not USERS:
    USERS = {
        "X": {
            "password": hash_password("xpass"),
            "accounts": {"PEN": 100.0, "USD": 200.0}
        },
        "Y": {
            "password": hash_password("ypass"),
            "accounts": {"PEN": 50.0, "USD": 100.0}
        }
    }

if not HISTORY:
    HISTORY = {"X": [], "Y": []}

# ------------------- GUARDAR -------------------
def save_json(file, data):
    with open(file, "w") as f:
        json.dump(data, f, indent=4)

def save_users():
    save_json(USERS_FILE, USERS)

def save_history():
    save_json(HISTORY_FILE, HISTORY)
