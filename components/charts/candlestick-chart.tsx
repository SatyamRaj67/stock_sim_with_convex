import React from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

// Sample candlestick data (OHLC format)
const candlestickData = [
  {
    date: "2024-01-01",
    open: 100,
    high: 110,
    low: 95,
    close: 108,
    volume: 12500,
  },
  {
    date: "2024-01-02",
    open: 108,
    high: 115,
    low: 105,
    close: 112,
    volume: 15200,
  },
  {
    date: "2024-01-03",
    open: 112,
    high: 118,
    low: 110,
    close: 115,
    volume: 18700,
  },
  {
    date: "2024-01-04",
    open: 115,
    high: 120,
    low: 112,
    close: 117,
    volume: 14300,
  },
  {
    date: "2024-01-05",
    open: 117,
    high: 125,
    low: 115,
    close: 122,
    volume: 16800,
  },
  {
    date: "2024-01-06",
    open: 122,
    high: 128,
    low: 120,
    close: 125,
    volume: 19200,
  },
  {
    date: "2024-01-07",
    open: 125,
    high: 130,
    low: 123,
    close: 127,
    volume: 17500,
  },
  {
    date: "2024-01-08",
    open: 127,
    high: 132,
    low: 125,
    close: 130,
    volume: 20100,
  },
  {
    date: "2024-01-09",
    open: 130,
    high: 135,
    low: 128,
    close: 133,
    volume: 22400,
  },
  {
    date: "2024-01-10",
    open: 133,
    high: 138,
    low: 131,
    close: 136,
    volume: 18900,
  },
  {
    date: "2024-01-11",
    open: 136,
    high: 140,
    low: 134,
    close: 138,
    volume: 21700,
  },
  {
    date: "2024-01-12",
    open: 138,
    high: 142,
    low: 135,
    close: 140,
    volume: 19800,
  },
  {
    date: "2024-01-13",
    open: 140,
    high: 145,
    low: 138,
    close: 143,
    volume: 23600,
  },
  {
    date: "2024-01-14",
    open: 143,
    high: 148,
    low: 141,
    close: 146,
    volume: 25100,
  },
  {
    date: "2024-01-15",
    open: 146,
    high: 150,
    low: 144,
    close: 148,
    volume: 22800,
  },
  {
    date: "2024-01-16",
    open: 148,
    high: 152,
    low: 146,
    close: 150,
    volume: 24300,
  },
  {
    date: "2024-01-17",
    open: 150,
    high: 155,
    low: 148,
    close: 153,
    volume: 26700,
  },
  {
    date: "2024-01-18",
    open: 153,
    high: 158,
    low: 151,
    close: 156,
    volume: 28200,
  },
  {
    date: "2024-01-19",
    open: 156,
    high: 160,
    low: 154,
    close: 158,
    volume: 25900,
  },
  {
    date: "2024-01-20",
    open: 158,
    high: 162,
    low: 156,
    close: 160,
    volume: 27400,
  },
];

// Custom candlestick component
const Candlestick = (props: any) => {
  const { payload, x, y, width, height } = props;

  if (!payload) return null;

  const { open, high, low, close } = payload;
  const isPositive = close >= open;

  // Calculate positions
  const bodyHeight = Math.abs(close - open);
  const bodyY = Math.min(close, open);
  const wickX = x + width / 2;

  // Scale factors (assuming the chart area represents the data range)
  const priceRange = 70; // Approximate range from our data (160 - 90)
  const chartHeight = height || 300; // Default chart height
  const pixelsPerPoint = chartHeight / priceRange;

  // Convert prices to pixel positions (inverted Y-axis)
  const highY = y - (high - Math.max(close, open)) * pixelsPerPoint;
  const lowY = y + (Math.min(close, open) - low) * pixelsPerPoint;
  const bodyPixelHeight = bodyHeight * pixelsPerPoint;
  const bodyPixelY = y - (bodyY - Math.min(close, open)) * pixelsPerPoint;

  return (
    <g>
      {/* High-Low wick */}
      <line
        x1={wickX}
        y1={highY}
        x2={wickX}
        y2={lowY}
        stroke={isPositive ? "#10b981" : "#ef4444"}
        strokeWidth={1}
        opacity={0.8}
      />

      {/* Candlestick body */}
      <rect
        x={x + width * 0.25}
        y={bodyPixelY}
        width={width * 0.5}
        height={Math.max(bodyPixelHeight, 1)}
        fill={isPositive ? "url(#greenGradient)" : "url(#redGradient)"}
        stroke={isPositive ? "#059669" : "#dc2626"}
        strokeWidth={1}
        rx={1}
      />
    </g>
  );
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data.close >= data.open;
    const change = (((data.close - data.open) / data.open) * 100).toFixed(2);

    return (
      <div className="rounded-lg border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
        <p className="mb-2 text-sm font-medium text-gray-900">{label}</p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-gray-500">Open</p>
            <p className="font-semibold">${data.open.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500">High</p>
            <p className="font-semibold">${data.high.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500">Low</p>
            <p className="font-semibold">${data.low.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500">Close</p>
            <p className="font-semibold">${data.close.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-3 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span
              className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Volume: {data.volume.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CandlestickChart = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Stock Price Analysis
          </h1>
          <p className="text-gray-600">
            Interactive candlestick chart showing OHLC data with volume
            indicators
          </p>
        </div>

        {/* Chart Container */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Price Chart
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  20-day period • Jan 2024
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-gradient-to-r from-green-400 to-green-600"></div>
                  <span className="text-gray-600">Bullish</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-gradient-to-r from-red-400 to-red-600"></div>
                  <span className="text-gray-600">Bearish</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <ResponsiveContainer width="100%" height={500}>
              <ComposedChart
                data={candlestickData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  {/* Gradient definitions */}
                  <linearGradient
                    id="greenGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient
                    id="backgroundGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f8fafc" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#f1f5f9" stopOpacity={0.4} />
                  </linearGradient>
                </defs>

                {/* Background fill */}
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#backgroundGradient)"
                />

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  strokeOpacity={0.5}
                  horizontal={true}
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickLine={{ stroke: "#cbd5e1" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />

                <YAxis
                  domain={["dataMin - 5", "dataMax + 5"]}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickLine={{ stroke: "#cbd5e1" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickFormatter={(value) => `$${value}`}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#94a3b8",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />

                {/* Custom candlestick bars */}
                <Bar dataKey="close" shape={<Candlestick />} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            {
              label: "Current Price",
              value: "$160.00",
              change: "+12.5%",
              positive: true,
              icon: TrendingUp,
            },
            {
              label: "Day High",
              value: "$162.00",
              change: "Today",
              positive: true,
              icon: TrendingUp,
            },
            {
              label: "Day Low",
              value: "$156.00",
              change: "Today",
              positive: false,
              icon: TrendingDown,
            },
            {
              label: "Volume",
              value: "27.4K",
              change: "+8.2%",
              positive: true,
              icon: TrendingUp,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <stat.icon
                  className={`h-4 w-4 ${stat.positive ? "text-green-500" : "text-red-500"}`}
                />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
                <span
                  className={`text-sm font-medium ${stat.positive ? "text-green-600" : "text-red-600"}`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandlestickChart;
