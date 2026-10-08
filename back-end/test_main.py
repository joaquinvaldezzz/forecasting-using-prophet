import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import pytest
from main import app, commodities

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'Hello!' in response.data

def test_get_commodities(client):
    response = client.get('/api/commodities')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert 'rice' in data

def test_get_insights(client):
    response = client.get('/api/insights')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == len(commodities)
    for item in data:
        assert 'commodity' in item
        assert 'current_price' in item
        assert 'trend' in item

def test_get_price_trends_valid_year(client):
    response = client.get('/api/price-trends/2023')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 12

def test_get_price_trends_invalid_year(client):
    response = client.get('/api/price-trends/1990')
    assert response.status_code == 400
