import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from prophet import Prophet

app = Flask(__name__)
CORS(app)


# Mock data for demonstration - replace it with an actual data source
def generate_mock_data():
    dates = pd.date_range(start='2018-01-01', end='2025-12-31', freq='ME')
    data = {
        'ds': dates,
        'rice': np.random.normal(40, 5, len(dates)).cumsum() + 100,
        'vegetables': np.random.normal(30, 4, len(dates)).cumsum() + 80,
        'meat': np.random.normal(250, 20, len(dates)).cumsum() + 1000
    }
    return pd.DataFrame(data)


# Initialize models for each commodity
models = {}
commodities = ['rice', 'vegetables', 'meat']


def train_models():
    df = generate_mock_data()
    for commodity in commodities:
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False,
            changepoint_prior_scale=0.05
        )
        model.add_country_holidays(country_name='PH')

        # Prepare data for Prophet
        prophet_df = df[['ds', commodity]].rename(columns={commodity: 'y'})
        model.fit(prophet_df)
        models[commodity] = model


# Train models on startup
train_models()

@app.route("/")
def index():
    return 'Hello!'


@app.route("/api/forecast", methods=['GET'])
def get_forecast():
    commodity = request.args.get('commodity', 'rice')
    if commodity not in commodities:
        return jsonify({'error': 'Invalid commodity'}), 400

    # Get historical data
    df = generate_mock_data()
    historical_data = df[['ds', commodity]].rename(columns={commodity: 'price'})
    historical_data['ds'] = historical_data['ds'].dt.strftime('%Y-%m-%d')

    # Generate forecast
    model = models[commodity]
    future = model.make_future_dataframe(periods=365)
    forecast = model.predict(future)

    # Format forecast data
    forecast_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(365)
    forecast_data['ds'] = forecast_data['ds'].dt.strftime('%Y-%m-%d')
    forecast_data = forecast_data.rename(columns={
        'yhat': 'price',
        'yhat_lower': 'lower_bound',
        'yhat_upper': 'upper_bound'
    })

    return jsonify({
        'historical': historical_data.to_dict('records'),
        'forecast': forecast_data.to_dict('records')
    })


@app.route("/api/commodities", methods=['GET'])
def get_commodities():
    return jsonify(commodities)


@app.route("/api/insights", methods=['GET'])
def get_insights():
    df = generate_mock_data()
    insights = []

    for commodity in commodities:
        recent_data = df[commodity].tail(12)  # Last 12 months
        avg_price = recent_data.mean()
        price_change = ((recent_data.iloc[-1] - recent_data.iloc[0]) / recent_data.iloc[0]) * 100

        insights.append({
            'commodity': commodity,
            'current_price': round(recent_data.iloc[-1], 2),
            'average_price': round(avg_price, 2),
            'price_change': round(price_change, 2),
            'trend': 'up' if price_change > 0 else 'down'
        })

    return jsonify(insights)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
