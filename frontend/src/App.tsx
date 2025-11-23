import { useState, useEffect } from "react";
import { getStockHistory } from "./api/stocks";
import type { StockQuote } from "./api/stocks";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function App() {
  const [data, setData] = useState<StockQuote[]>([]);
  const [symbol, setSymbol] = useState("AAPL");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getStockHistory(symbol);
      setData(result);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Stock History</h1>

      <input
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter symbol"
      />

      <button onClick={fetchData}>Search</button>

      {loading && <p>Loading...</p>}

      <LineChart width={800} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="close" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}

export default App;
