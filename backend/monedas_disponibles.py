# backend/monedas_disponibles.py
from fastapi import APIRouter, HTTPException
import requests

router = APIRouter()

@router.get("/monedas")
def obtener_monedas():
    url = "https://api.exchangerate-api.com/v4/latest/USD"
    response = requests.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="No se pudo obtener la lista de monedas")

    data = response.json()
    monedas = list(data["rates"].keys())
    monedas.sort()
    return {"monedas_disponibles": monedas}