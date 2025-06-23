# backend/utils.py
import hashlib
import secrets

# Hashea contraseña simple (no usar en producción)
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

# Generador de token simple
def generate_token() -> str:
    return secrets.token_hex(16)