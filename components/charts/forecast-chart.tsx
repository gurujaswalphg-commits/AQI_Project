"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ForecastChartProps {
  data: {
    city: string;
    baseline: number[];
    adjusted: number[];
  }[];
  forecastDays: number;
}

const COLORS = [
  "#22d3ee",
  "#a78bfa",
  "#f472b6",
  "#fb923c",
  "#4ade80",
  "#facc15",
];

export function ForecastChart({ data, forecastDays }: ForecastChartProps) {
  const chartData = Array.from({ length: forecastDays }, (_, i) => {
    const point: Record<string, number | string> = { day: `Day ${i + 1}` };
    data.forEach((city, idx) => {
      point[`${city.city}_baseline`] = Math.round(city.baseline[i]);
      point[`${city.city}_adjusted`] = Math.round(city.adjusted[i]);
    });
    return point;
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg">AQI Forecast with Policy Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="day"
                stroke="#888"
                fontSize={10}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis stroke="#888" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a2e",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <ReferenceLine
                y={50}
                stroke="#22c55e"
                strokeDasharray="5 5"
                label={{ value: "WHO Safe", fill: "#22c55e", fontSize: 10 }}
              />
              <ReferenceLine
                y={100}
                stroke="#f97316"
                strokeDasharray="5 5"
                label={{ value: "Moderate", fill: "#f97316", fontSize: 10 }}
              />
              {data.map((city, idx) => (
                <Line
                  key={`${city.city}_baseline`}
                  type="monotone"
                  dataKey={`${city.city}_baseline`}
                  stroke={COLORS[idx % COLORS.length]}
                  name={`${city.city} Baseline`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
              {data.map((city, idx) => (
                <Line
                  key={`${city.city}_adjusted`}
                  type="monotone"
                  dataKey={`${city.city}_adjusted`}
                  stroke={COLORS[idx % COLORS.length]}
                  name={`${city.city} Adjusted`}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  opacity={0.7}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
