# backend/exchange.py
from abc import ABC, abstractmethod
import requests
import time

class ExchangeRateProvider(ABC):
    @abstractmethod
    def get_rate(self, from_currency: str, to_currency: str) -> float:
        pass

class APIExchangeRate1(ExchangeRateProvider):
    def __init__(self):
        self.cache = {}  # {(from, to): (rate, timestamp)}
        self.cache_expiration = 120  # segundos

    def get_rate(self, from_currency: str, to_currency: str) -> float:
        from_currency = from_currency.upper()
        to_currency = to_currency.upper()
        key = (from_currency, to_currency)
        now = time.time()

        # Si ya está en caché y no ha expirado
        if key in self.cache:
            rate, timestamp = self.cache[key]
            if now - timestamp < self.cache_expiration:
                return rate

        try:
            url = f"https://api.exchangerate-api.com/v4/latest/{from_currency}"
            resp = requests.get(url, timeout=5)
            if resp.status_code != 200:
                raise Exception("Error en API 1")
            data = resp.json()
            rate = data["rates"][to_currency]

            # Guardar en caché
            self.cache[key] = (rate, now)
            return rate
        except Exception:
            # Si falla, usar valor en caché viejo (si existe)
            if key in self.cache:
                rate, _ = self.cache[key]
                return rate
            raise Exception("No se pudo obtener la tasa de cambio")