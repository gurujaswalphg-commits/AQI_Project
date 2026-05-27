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
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generatePollutantData, pollutantInfo } from "@/lib/aqi-data";

interface PollutantChartProps {
  cities: string[];
  aqiData: Record<string, number>;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export function PollutantChart({
  cities,
  aqiData,
  selectedCity,
  setSelectedCity,
}: PollutantChartProps) {
  const aqi = aqiData[selectedCity] || 100;
  const pollutants = generatePollutantData(aqi);

  const chartData = Object.entries(pollutants).map(([name, value]) => ({
    name,
    value: Math.round(value * 10) / 10,
    threshold: pollutantInfo[name]?.badThreshold || 50,
    unit: pollutantInfo[name]?.unit || "",
    isHigh: value > (pollutantInfo[name]?.badThreshold || 50),
  }));

  const allCitiesPollutants = cities.map((city) => {
    const cityAqi = aqiData[city] || 100;
    const cityPollutants = generatePollutantData(cityAqi);
    return {
      city,
      ...cityPollutants,
    };
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg">Pollutant Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="h-[300px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" fontSize={10} />
                <YAxis stroke="#888" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string, props: { payload: { unit: string } }) => [
                    `${value} ${props.payload.unit}`,
                    name,
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Bar dataKey="value" name="Current Level" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isHigh ? "#ef4444" : "#22d3ee"}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="threshold"
                  name="Safe Threshold"
                  fill="#4ade80"
                  opacity={0.5}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg">All Cities Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <table className="w-full text-xs md:text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium">City</th>
                  <th className="text-right py-2 font-medium">PM2.5</th>
                  <th className="text-right py-2 font-medium">PM10</th>
                  <th className="text-right py-2 font-medium">NO2</th>
                  <th className="text-right py-2 font-medium">SO2</th>
                  <th className="text-right py-2 font-medium">O3</th>
                  <th className="text-right py-2 font-medium">CO</th>
                </tr>
              </thead>
              <tbody>
                {allCitiesPollutants.map((row) => (
                  <tr key={row.city} className="border-b border-border/50">
                    <td className="py-2 font-medium">{row.city}</td>
                    <td className="text-right py-2 text-muted-foreground">
                      {row["PM2.5"].toFixed(1)}
                    </td>
                    <td className="text-right py-2 text-muted-foreground">
                      {row.PM10.toFixed(1)}
                    </td>
                    <td className="text-right py-2 text-muted-foreground">
                      {row.NO2.toFixed(1)}
                    </td>
                    <td className="text-right py-2 text-muted-foreground">
                      {row.SO2.toFixed(1)}
                    </td>
                    <td className="text-right py-2 text-muted-foreground">
                      {row.O3.toFixed(1)}
                    </td>
                    <td className="text-right py-2 text-muted-foreground">
                      {row.CO.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
