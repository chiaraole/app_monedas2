# backend/exchange.py
from abc import ABC, abstractmethod
import requests

class ExchangeRateProvider(ABC):
    @abstractmethod
    def get_rate(self, from_currency: str, to_currency: str) -> float:
        pass

class APIExchangeRate1(ExchangeRateProvider):
    def get_rate(self, from_currency: str, to_currency: str) -> float:
        url = f"https://api.exchangerate-api.com/v4/latest/{from_currency}"
        resp = requests.get(url)
        if resp.status_code != 200:
            raise Exception("Error en API 1")
        return resp.json()["rates"][to_currency]

class APIExchangeRate2(ExchangeRateProvider):
    def get_rate(self, from_currency: str, to_currency: str) -> float:
        url = f"https://open.er-api.com/v6/latest/{from_currency}"
        resp = requests.get(url)
        if resp.status_code != 200:
            raise Exception("Error en API 2")
        return resp.json()["rates"][to_currency]