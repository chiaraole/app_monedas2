def test_register_and_login(client):
    res = client.post("/auth/register", json={
    "username": "usuariotest_nuevo2",  # cambia este valor
    "password": "1234",
    "email": "nuevo2@example.com",
    "phone": "999000112"
})
    assert res.status_code == 200

    res = client.post("/auth/login", json={
        "username": "usuariotest1",
        "password": "1234"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()