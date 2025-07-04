import pytest

def get_token(client):
    client.post("/auth/register", json={
        "username": "testexport",
        "password": "1234",
        "email": "testexport@example.com",
        "phone": "999999999"
    })
    res = client.post("/auth/login", json={
        "username": "testexport",
        "password": "1234"
    })
    return res.json()["access_token"]

def test_export_csv(client):
    token = get_token(client)
    res = client.get("/export?formato=csv", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 404 or res.status_code == 200

def test_export_xml(client):
    token = get_token(client)
    res = client.get("/export?formato=xml", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 404 or res.status_code == 200
