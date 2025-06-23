# backend/transactions.py
from fastapi import APIRouter, HTTPException, Depends
from models import TransferRequest, TransferRecord
from database import USERS, HISTORY, save_users, save_history
from auth import get_current_user
from exchange import APIExchangeRate1  # o APIExchangeRate2

router = APIRouter()
exchange = APIExchangeRate1()  # Cambia aquí si deseas usar APIExchangeRate2()

@router.post("/send")
def transfer(req: TransferRequest, sender: str = Depends(get_current_user)):
    if sender == req.to_user:
        raise HTTPException(status_code=400, detail="No puedes transferirte a ti mismo")

    if req.to_user not in USERS:
        raise HTTPException(status_code=404, detail="Destinatario no encontrado")

    if req.from_currency not in USERS[sender]["accounts"] or \
       req.to_currency not in USERS[req.to_user]["accounts"]:
        raise HTTPException(status_code=400, detail="Moneda no soportada")

    if USERS[sender]["accounts"][req.from_currency] < req.amount:
        raise HTTPException(status_code=400, detail="Fondos insuficientes")

    rate = exchange.get_rate(req.from_currency, req.to_currency)
    converted = round(req.amount * rate, 2)

    USERS[sender]["accounts"][req.from_currency] -= req.amount
    USERS[req.to_user]["accounts"][req.to_currency] += converted
    save_users()

    record = TransferRecord(
        from_user=sender,
        to_user=req.to_user,
        amount=req.amount,
        from_currency=req.from_currency,
        to_currency=req.to_currency,
        converted=converted,
        rate=rate
    )
    HISTORY.setdefault(sender, []).append(record.dict())
    HISTORY.setdefault(req.to_user, []).append(record.dict())
    save_history()

    return {"message": "Transferencia exitosa", "record": record}


@router.get("/history")
def get_my_history(username: str = Depends(get_current_user)):
    return HISTORY.get(username, [])


@router.post("/convert-self")
def convert_self(req: TransferRequest, sender: str = Depends(get_current_user)):
    if req.to_user and req.to_user != sender:
        raise HTTPException(status_code=400, detail="Solo puedes convertir para ti mismo")

    if req.from_currency == req.to_currency:
        raise HTTPException(status_code=400, detail="Las monedas deben ser diferentes")

    if req.from_currency not in USERS[sender]["accounts"] or \
       req.to_currency not in USERS[sender]["accounts"]:
        raise HTTPException(status_code=400, detail="Moneda no soportada")

    if USERS[sender]["accounts"][req.from_currency] < req.amount:
        raise HTTPException(status_code=400, detail="Fondos insuficientes")

    rate = exchange.get_rate(req.from_currency, req.to_currency)
    converted = round(req.amount * rate, 2)

    USERS[sender]["accounts"][req.from_currency] -= req.amount
    USERS[sender]["accounts"][req.to_currency] += converted
    save_users()

    record = TransferRecord(
        from_user=sender,
        to_user=sender,
        amount=req.amount,
        from_currency=req.from_currency,
        to_currency=req.to_currency,
        converted=converted,
        rate=rate
    )
    HISTORY.setdefault(sender, []).append(record.dict())
    save_history()

    return {"message": "Conversión interna exitosa", "record": record}

