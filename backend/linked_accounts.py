# backend/linked_accounts.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from auth import get_current_user
from database import USERS, save_users
import json, os

LINKED_FILE = "linked_accounts.json"

# ------------------- MODELOS -------------------
class LinkedAccount(BaseModel):
    alias: str
    banco: str
    numero: str
    moneda: str  # Ahora puede ser cualquier moneda soportada

class ExternalTransfer(BaseModel):
    alias: str
    amount: float
    moneda: str

# ------------------- CARGA Y GUARDADO -------------------
def load_linked():
    if os.path.exists(LINKED_FILE):
        with open(LINKED_FILE, "r") as f:
            return json.load(f)
    return {}

def save_linked(data):
    with open(LINKED_FILE, "w") as f:
        json.dump(data, f, indent=4)

LINKED = load_linked()

# ------------------- ROUTER -------------------
router = APIRouter()

@router.post("/add")
def add_account(account: LinkedAccount, user: str = Depends(get_current_user)):
    LINKED.setdefault(user, [])
    if any(acc["alias"] == account.alias for acc in LINKED[user]):
        raise HTTPException(status_code=400, detail="Ya existe una cuenta con ese alias")

    LINKED[user].append(account.dict())
    save_linked(LINKED)

    # Añadir moneda nueva a cuentas si no existe
    if account.moneda not in USERS[user]["accounts"]:
        USERS[user]["accounts"][account.moneda] = 0.0
        save_users()

    return {"message": f"Cuenta afiliada en {account.moneda} registrada."}

@router.get("/list", response_model=List[LinkedAccount])
def list_accounts(user: str = Depends(get_current_user)):
    return LINKED.get(user, [])

@router.post("/transfer")
def transfer_to_account(data: ExternalTransfer, user: str = Depends(get_current_user)):
    alias = data.alias
    amount = data.amount
    moneda = data.moneda

    cuentas = LINKED.get(user, [])
    cuenta = next((c for c in cuentas if c["alias"] == alias), None)

    if not cuenta:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada")

    if cuenta["moneda"] != moneda:
        raise HTTPException(status_code=400, detail="No puedes transferir monedas distintas")

    if moneda not in USERS[user]["accounts"] or USERS[user]["accounts"][moneda] < amount:
        raise HTTPException(status_code=400, detail="Fondos insuficientes")

    USERS[user]["accounts"][moneda] -= amount
    save_users()

    return {
        "message": f"Transferencia de {amount} {moneda} a cuenta '{alias}' ({cuenta['banco']}) exitosa."
    }

@router.post("/deposit")
def deposit_from_account(data: ExternalTransfer, user: str = Depends(get_current_user)):
    alias = data.alias
    amount = data.amount
    moneda = data.moneda

    cuentas = LINKED.get(user, [])
    cuenta = next((c for c in cuentas if c["alias"] == alias), None)

    if not cuenta:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada")

    if cuenta["moneda"] != moneda:
        raise HTTPException(status_code=400, detail="No puedes depositar monedas distintas")

    if moneda not in USERS[user]["accounts"]:
        USERS[user]["accounts"][moneda] = 0.0

    USERS[user]["accounts"][moneda] += amount
    save_users()

    return {
        "message": f"Recarga de {amount} {moneda} desde cuenta '{alias}' ({cuenta['banco']}) exitosa."
    }