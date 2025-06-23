# backend/dashboard.py
from fastapi import APIRouter, Depends
from auth import get_current_user
from database import USERS, HISTORY
import json, os

router = APIRouter()

LINKED_FILE = "linked_accounts.json"

def load_linked():
    if os.path.exists(LINKED_FILE):
        with open(LINKED_FILE, "r") as f:
            return json.load(f)
    return {}

@router.get("/summary")
def get_user_dashboard(user: str = Depends(get_current_user)):
    balances = USERS[user]["accounts"]
    history = HISTORY.get(user, [])[-5:]  # últimas 5 transacciones
    linked = load_linked().get(user, [])

    return {
        "usuario": user,
        "saldo": balances,
        "ultimas_transacciones": history,
        "cuentas_afiliadas": linked
    }