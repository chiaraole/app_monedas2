# backend/users.py
from fastapi import APIRouter, Depends
from database import USERS
from auth import get_current_user

router = APIRouter()

@router.get("/me")
def get_me(username: str = Depends(get_current_user)):
    return USERS[username]["accounts"]