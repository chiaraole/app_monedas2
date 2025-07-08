from backend.exchange import APIExchangeRate1
import time

def test_get_rate_success():
    exchange = APIExchangeRate1()
    rate = exchange.get_rate("USD", "PEN")
    assert isinstance(rate, float)
    assert rate > 0

def test_get_rate_cached():
    exchange = APIExchangeRate1()
    first = exchange.get_rate("USD", "PEN")
    time.sleep(1)
    second = exchange.get_rate("USD", "PEN")
    assert first == second  # Debe usar caché, misma tasa

def test_cache_expires():
    exchange = APIExchangeRate1()
    exchange.cache_expiration = 1  # 1 segundo para probar expiración
    rate1 = exchange.get_rate("USD", "PEN")
    time.sleep(2)
    rate2 = exchange.get_rate("USD", "PEN")
    assert isinstance(rate2, float)