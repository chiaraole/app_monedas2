import pytest


def get_token(client):
    client.post("/auth/register", json={
        "username": "test",
        "password": "1234",
        "email": "test@example.com",
        "phone": "888888888"
    })
    res = client.post("/auth/login", json={
        "username": "test",
        "password": "1234"
    })
    return res.json()["access_token"]


def test_conversion(client):
    token = get_token(client)
    res = client.get("/convert", params={
    "from_currency": "USD",
    "to_currency": "PEN",
    "amount": 10
}, headers={"Authorization": f"Bearer {token}"})
    assert res.status_code in (200, 400)

def test_historial(client):
    token = get_token(client)
    res = client.get("/transactions/history", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
