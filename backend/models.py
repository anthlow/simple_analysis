from pydantic import BaseModel

class StockQuote(BaseModel):
    symbol: str
    current_price: float
    high: float
    low: float
    open: float
    previous_close: float