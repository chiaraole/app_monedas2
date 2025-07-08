from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_convert_same_currency():
    res = client.get("/convert?from_currency=USD&to_currency=USD&amount=10")
    assert res.status_code == 200
    data = res.json()
    assert data["converted"] == 10.0
    assert data["rate"] == 1.0

def test_convert_different_currency():
    res = client.get("/convert?from_currency=USD&to_currency=PEN&amount=10")
    assert res.status_code == 200
    data = res.json()
    assert "converted" in data
    assert "rate" in data
    assert data["converted"] > 0
    assert data["rate"] > 0