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
  ResponsiveContainer,
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

  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <>
      <div
        style={{
          width: "80vw",
          height: 500,
          padding: "0 0 50px 50px",
        }}
      >
        <h1>Stock History</h1>

        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter symbol"
        />

        <button onClick={fetchData}>Search</button>

        {loading && <p>Loading...</p>}

        <div
          style={{
            display: "flex",
            justifyContent: "center", // horizontal centering
            width: "100%", // parent takes full width
          }}
        >
          <ResponsiveContainer width="80%" height={500}>
            <LineChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                }
                label={{
                  value: "Date",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  value: "Price ($)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                }}
              />
              <Tooltip
                formatter={(value: number) => `$${value.toFixed(2)}`}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false} // remove dots for a smooth line
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

export default App;
