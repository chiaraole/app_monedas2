# backend/auth.py
from fastapi import APIRouter, HTTPException, Depends, Header
from models import UserRegister, UserLogin, TokenResponse
from database import USERS, save_users
from utils import hash_password, verify_password, generate_token

router = APIRouter()
TOKENS = {}  # token -> username

@router.post("/register")
def register(user: UserRegister):
    if user.username in USERS:
        raise HTTPException(status_code=400, detail="Usuario ya registrado")

    for data in USERS.values():
        if data.get("email") == user.email:
            raise HTTPException(status_code=400, detail="Correo ya registrado")
        if data.get("phone") == user.phone:
            raise HTTPException(status_code=400, detail="Teléfono ya registrado")

    USERS[user.username] = {
        "password": hash_password(user.password),
        "email": user.email,
        "phone": user.phone,
        "accounts": {"PEN": 0.0, "USD": 0.0}
    }
    save_users()
    return {"message": "Usuario registrado exitosamente"}

@router.post("/login", response_model=TokenResponse)
def login(user: UserLogin):
    db_user = USERS.get(user.username)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    token = generate_token()
    TOKENS[token] = user.username
    return TokenResponse(access_token=token)

def get_current_user(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user = TOKENS.get(token)
    if not user:
        raise HTTPException(status_code=401, detail="Token inválido")
    return user