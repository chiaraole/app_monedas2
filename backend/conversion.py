# backend/conversion.py
from fastapi import APIRouter, HTTPException, Query
from exchange import APIExchangeRate1

router = APIRouter()
exchange = APIExchangeRate1()

@router.get("/convert")
def convert_currency(
    from_currency: str = Query(...),
    to_currency: str = Query(...),
    amount: float = Query(...)
):
    if from_currency == to_currency:
        return {"converted": round(amount, 2), "rate": 1.0}

    try:
        rate = exchange.get_rate(from_currency, to_currency)
        converted = round(amount * rate, 2)
        return {"converted": converted, "rate": rate}
    except Exception as e:
        raise HTTPException(status_code=500, detail="No se pudo obtener la tasa de cambio")