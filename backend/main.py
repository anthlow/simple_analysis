from fastapi import FastAPI, HTTPException
from models import StockQuote
import finnhub
from dotenv import load_dotenv
import os

# Load .env File
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# Setup client
finnhub_client = finnhub.Client(os.getenv("FINNHUB_API_KEY"))

# Get Stock Info
@app.get('/stock/{symbol}', response_model=StockQuote)
def get_stock(symbol: str):
    raw_data = finnhub_client.quote(symbol.upper())

    if raw_data["c"] == 0:
        raise HTTPException(status_code=404, detail="Ticker not found.")
    
    clean_data = StockQuote(
        symbol=symbol.upper(),
        current_price=raw_data["c"],
        high=raw_data["h"],
        low=raw_data["l"],
        open=raw_data["o"],
        previous_close=raw_data["pc"]
    )

    return clean_data