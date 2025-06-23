# backend/models.py
from pydantic import BaseModel, Field
from typing import Optional, List

class UserRegister(BaseModel):
    username: str
    password: str
    email: str
    phone: str

class UserLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class Account(BaseModel):
    currency: str  # "PEN" o "USD"
    balance: float = 0.0

class TransferRequest(BaseModel):
    to_user: str
    amount: float
    from_currency: str
    to_currency: str

class TransferRecord(BaseModel):
    from_user: str
    to_user: str
    amount: float
    from_currency: str
    to_currency: str
    converted: float
    rate: float