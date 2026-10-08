import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import pytest
from fastapi.testclient import TestClient
from main import app, commodities


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def test_index(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "Hello!" in response.text


def test_get_commodities(client):
    response = client.get("/api/commodities")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert "rice" in data


def test_get_insights(client):
    response = client.get("/api/insights")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == len(commodities)
    for item in data:
        assert "commodity" in item
        assert "current_price" in item
        assert "trend" in item


def test_get_price_trends_valid_year(client):
    response = client.get("/api/price-trends/2023")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 12


def test_get_price_trends_invalid_year(client):
    response = client.get("/api/price-trends/1990")
    assert response.status_code == 400


def test_get_forecast_valid_and_invalid(client):
    response = client.get("/api/forecast?commodities=rice")
    assert response.status_code == 200
    data = response.json()
    assert "rice" in data
    assert "historical" in data["rice"]
    assert "forecast" in data["rice"]
    assert len(data["rice"]["historical"]) > 0
    assert len(data["rice"]["forecast"]) == 365

    # Invalid commodity
    response_invalid = client.get("/api/forecast?commodities=invalid_item")
    assert response_invalid.status_code == 400
