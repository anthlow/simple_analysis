from pydantic import BaseModel
from datetime import datetime

class StockQuote(BaseModel):
    date: datetime
    symbol: str
    high: float
    low: float
    open: float
    close: float
    volume: int