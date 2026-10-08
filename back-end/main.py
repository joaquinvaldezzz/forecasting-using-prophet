from contextlib import asynccontextmanager
from typing import Optional

import numpy as np
import pandas as pd
import uvicorn
from fastapi import FastAPI, HTTPException, Path, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from prophet import Prophet
from pydantic import BaseModel


# Mock data for demonstration - replace it with an actual data source
def generate_mock_data(seed: int = 42) -> pd.DataFrame:
    """
    Generate deterministic mock food price data for demonstration purposes.
    """
    rng = np.random.default_rng(seed)
    dates = pd.date_range(start="2018-01-01", end="2025-12-31", freq="ME")
    n = len(dates)
    data = {
        "ds": dates,
        "rice": rng.normal(0.5, 1.2, n).cumsum() + 45.0,
        "vegetables": rng.normal(0.4, 1.5, n).cumsum() + 35.0,
        "meat": rng.normal(1.2, 3.0, n).cumsum() + 280.0,
    }
    df = pd.DataFrame(data)
    # Ensure prices remain positive and realistic
    for col in ["rice", "vegetables", "meat"]:
        df[col] = df[col].clip(lower=10.0)
    return df


# Cached dataset shared across all endpoints
DATASET = generate_mock_data(42)

# Initialize models for each commodity
models: dict[str, Prophet] = {}
commodities = ["rice", "vegetables", "meat"]


def train_models():
    """
    Train models for each commodity.
    """
    df = DATASET.copy()
    for commodity in commodities:
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False,
            changepoint_prior_scale=0.05,
        )
        model.add_country_holidays(country_name="PH")

        # Prepare data for Prophet
        prophet_df = df[["ds", commodity]].rename(columns={commodity: "y"})
        model.fit(prophet_df)
        models[commodity] = model


@asynccontextmanager
async def lifespan(app: FastAPI):
    train_models()
    yield
    models.clear()


app = FastAPI(
    title="Food Price Forecasting API",
    description="Time-series commodity price predictions and trend analysis powered by Prophet.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InsightItem(BaseModel):
    commodity: str
    current_price: float
    average_price: float
    price_change: float
    trend: str


class PriceTrendItem(BaseModel):
    month: str
    rice: float
    vegetables: float
    meat: float


class HistoricalPoint(BaseModel):
    ds: str
    price: float


class ForecastPoint(BaseModel):
    ds: str
    price: float
    lower_bound: float
    upper_bound: float


class CommodityForecast(BaseModel):
    historical: list[HistoricalPoint]
    forecast: list[ForecastPoint]


@app.get("/", response_class=PlainTextResponse)
def index() -> str:
    return "Hello!"


@app.get("/api/commodities", response_model=list[str])
def get_commodities() -> list[str]:
    """
    Get all commodities.
    """
    return commodities


@app.get("/api/insights", response_model=list[InsightItem])
def get_insights() -> list[InsightItem]:
    """
    Get insights for all commodities.
    """
    df = DATASET.copy()
    insights: list[InsightItem] = []

    for commodity in commodities:
        recent_data = df[commodity].tail(12)  # Last 12 months
        avg_price = float(recent_data.mean())
        price_change = float(
            ((recent_data.iloc[-1] - recent_data.iloc[0]) / recent_data.iloc[0]) * 100
        )

        insights.append(
            InsightItem(
                commodity=commodity,
                current_price=round(float(recent_data.iloc[-1]), 2),
                average_price=round(avg_price, 2),
                price_change=round(price_change, 2),
                trend="up" if price_change > 0 else "down",
            )
        )

    return insights


@app.get("/api/price-trends/{year}", response_model=list[PriceTrendItem])
def get_price_trends(
    year: int = Path(..., description="Year between 2018 and 2025")
) -> list[PriceTrendItem]:
    """
    Get price trends data for a specific year.
    """
    if year < 2018 or year > 2025:
        raise HTTPException(status_code=400, detail="Year out of range")

    df = DATASET.copy()
    year_data = df[df["ds"].dt.year == year].copy()

    formatted_data: list[PriceTrendItem] = []
    for _, row in year_data.iterrows():
        formatted_data.append(
            PriceTrendItem(
                month=row["ds"].strftime("%b"),
                rice=round(float(row["rice"]), 2),
                vegetables=round(float(row["vegetables"]), 2),
                meat=round(float(row["meat"]), 2),
            )
        )

    return formatted_data


@app.get("/api/forecast", response_model=dict[str, CommodityForecast])
def get_forecast(
    commodities_param: Optional[str] = Query(default=None, alias="commodities")
) -> dict[str, CommodityForecast]:
    """
    Get forecast data for given commodities. If no commodities are specified, returns all.
    """
    if not commodities_param or not commodities_param.strip():
        requested_commodities = commodities
    else:
        requested_commodities = [
            c.strip() for c in commodities_param.split(",") if c.strip()
        ]
        invalid_commodities = [
            c for c in requested_commodities if c not in commodities
        ]
        if invalid_commodities:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid commodities: {', '.join(invalid_commodities)}",
            )

    df = DATASET.copy()
    result: dict[str, CommodityForecast] = {}

    for commodity in requested_commodities:
        # Historical data
        historical_data = df[["ds", commodity]].rename(columns={commodity: "price"})
        historical_data["ds"] = historical_data["ds"].dt.strftime("%Y-%m-%d")

        # Generate forecast
        model = models[commodity]
        future = model.make_future_dataframe(periods=365)
        forecast = model.predict(future)

        # Format forecast data
        forecast_data = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(365).copy()
        forecast_data["ds"] = forecast_data["ds"].dt.strftime("%Y-%m-%d")
        forecast_data = forecast_data.rename(
            columns={
                "yhat": "price",
                "yhat_lower": "lower_bound",
                "yhat_upper": "upper_bound",
            }
        )

        result[commodity] = CommodityForecast(
            historical=historical_data.to_dict("records"),
            forecast=forecast_data.to_dict("records"),
        )

    return result


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)
