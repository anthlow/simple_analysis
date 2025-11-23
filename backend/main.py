from fastapi import FastAPI, HTTPException
from models import StockQuote
from alpha_vantage.timeseries import TimeSeries
from dotenv import load_dotenv
import os
from datetime import datetime
from typing import List
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware

# Load .env File
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# Setup CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Alpha Vantage Client
ts = TimeSeries(key = os.getenv("ALPHAVANTAGE_API_KEY"), output_format='json')

# Favicon Error Mute
@app.get("/favicon.ico")
def favicon():
    return Response(status_code=204)

# Get Stock Info
@app.get('/stock/{symbol}', response_model=List[StockQuote])
def get_stock(symbol: str):
    try:
        data, meta_data = ts.get_daily(symbol=symbol.upper(), outputsize='compact')
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Filter for current year (YTD)
    current_year = str(datetime.now().year)
    ytd_data = {date: vals for date, vals in data.items() if date.startswith(current_year)}

    # Sort dates ascending
    sorted_dates = sorted(ytd_data.keys())

    result = []
    for date in sorted_dates:
        day_data = ytd_data[date]
        result.append(StockQuote(
            date=date,
            symbol= symbol,
            high=float(day_data['2. high']),
            low=float(day_data['3. low']),
            open=float(day_data['1. open']),
            close=float(day_data['4. close']),
            volume=int(day_data['5. volume'])
        ))

    return result