# tests/test_auth_unit.py
import pytest
from backend.auth import register, login, USERS
from backend.models import UserRegister, UserLogin
from backend.database import save_users
from backend.utils import verify_password

def test_register_new_user():
    test_username = "testuser"

    # Limpieza antes del test
    if test_username in USERS:
        del USERS[test_username]
        save_users()

    user = UserRegister(
        username=test_username,
        password="testpass",
        email="testuser@example.com",
        phone="999123456"
    )

    response = register(user)
    assert response == {"message": "Usuario registrado exitosamente"}
    assert test_username in USERS
    assert verify_password("testpass", USERS[test_username]["password"])

    # Limpieza después del test
    del USERS[test_username]
    save_users()

def test_register_duplicate_username():
    user = UserRegister(
        username="X",  # ya está registrado por defecto
        password="1234",
        email="otro@example.com",
        phone="987654321"
    )
    with pytest.raises(Exception) as e:
        register(user)
    assert "Usuario ya registrado" in str(e.value)

def test_login_successful():
    credentials = UserLogin(username="X", password="xpass")
    response = login(credentials)
    assert "access_token" in response.model_dump()

def test_login_invalid():
    credentials = UserLogin(username="X", password="wrongpass")
    with pytest.raises(Exception) as e:
        login(credentials)
    assert "Credenciales incorrectas" in str(e.value)