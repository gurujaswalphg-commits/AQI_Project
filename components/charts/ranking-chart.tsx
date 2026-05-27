"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAqiCategory } from "@/lib/aqi-data";

interface RankingChartProps {
  data: {
    city: string;
    currentAqi: number;
    avgBaseline: number;
    avgAdjusted: number;
    improvement: number;
    improvementPct: number;
  }[];
}

export function RankingChart({ data }: RankingChartProps) {
  const sortedData = [...data].sort((a, b) => a.avgAdjusted - b.avgAdjusted);

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg">Cities by Air Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" fontSize={10} />
                <YAxis
                  dataKey="city"
                  type="category"
                  stroke="#888"
                  fontSize={10}
                  width={80}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <ReferenceLine
                  x={50}
                  stroke="#22c55e"
                  strokeDasharray="5 5"
                />
                <Bar dataKey="avgAdjusted" name="Adjusted AQI" radius={[0, 4, 4, 0]}>
                  {sortedData.map((entry) => (
                    <Cell
                      key={entry.city}
                      fill={getAqiCategory(entry.avgAdjusted).color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg">Policy Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="city"
                  stroke="#888"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis stroke="#888" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Bar
                  dataKey="improvementPct"
                  name="Improvement %"
                  fill="#22d3ee"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
