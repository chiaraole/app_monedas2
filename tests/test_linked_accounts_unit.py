import pytest
from backend.linked_accounts import add_account, deposit_from_account, transfer_to_account, LINKED
from backend.linked_accounts import LinkedAccount, ExternalTransfer
from backend.database import USERS, save_users

def fake_user():
    return "X"

def setup_module(module):
    # Inicializa datos para usuario X
    USERS["X"] = {
        "accounts": {"USD": 100.0},
    }
    LINKED["X"] = []
    save_users()

def test_add_account():
    cuenta = LinkedAccount(
        alias="miCuentaBCP",
        banco="BCP",
        numero="12345678",
        moneda="USD"
    )
    response = add_account(cuenta, user=fake_user())
    assert response["message"] == "Cuenta afiliada en USD registrada."
    assert any(acc["alias"] == "miCuentaBCP" for acc in LINKED["X"])

def test_deposit_from_account():
    deposito = ExternalTransfer(
        alias="miCuentaBCP",
        amount=50.0,
        moneda="USD"
    )
    response = deposit_from_account(deposito, user=fake_user())
    assert response["message"].startswith("Recarga de 50.0 USD")
    assert USERS["X"]["accounts"]["USD"] == 150.0

def test_transfer_to_account():
    transferencia = ExternalTransfer(
        alias="miCuentaBCP",
        amount=30.0,
        moneda="USD"
    )
    response = transfer_to_account(transferencia, user=fake_user())
    assert response["message"].startswith("Transferencia de 30.0 USD")
    assert USERS["X"]["accounts"]["USD"] == 120.0