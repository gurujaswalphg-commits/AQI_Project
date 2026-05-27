"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAqiCategory,
  aqiCategories,
  cityPopulation,
  calculateStatistics,
} from "@/lib/aqi-data";
import { Users, TrendingDown, TrendingUp, Activity } from "lucide-react";

interface StatisticsViewProps {
  cities: string[];
  aqiData: Record<string, number>;
  forecastData: {
    city: string;
    baseline: number[];
    adjusted: number[];
  }[];
}

export function StatisticsView({
  cities,
  aqiData,
  forecastData,
}: StatisticsViewProps) {
  // Calculate population exposure by AQI category
  const exposureData = aqiCategories.map((cat) => {
    const citiesInCategory = cities.filter((city) => {
      const aqi = aqiData[city] || 100;
      return aqi >= cat.range[0] && aqi <= cat.range[1];
    });
    const population = citiesInCategory.reduce(
      (sum, city) => sum + (cityPopulation[city] || 0),
      0
    );
    return {
      category: cat.category.split(" ")[0],
      population: Math.round(population / 1000000),
      color: cat.color,
      fullCategory: cat.category,
    };
  });

  // Calculate overall statistics
  const allBaseline = forecastData.flatMap((d) => d.baseline);
  const allAdjusted = forecastData.flatMap((d) => d.adjusted);
  const baselineStats = calculateStatistics(allBaseline);
  const adjustedStats = calculateStatistics(allAdjusted);

  const totalExposedUnhealthy = exposureData
    .filter((d) =>
      ["Unhealthy", "Very", "Hazardous"].includes(d.category)
    )
    .reduce((sum, d) => sum + d.population, 0);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Mean Baseline</p>
                <p className="text-lg md:text-2xl font-bold">
                  {baselineStats.mean.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Mean Adjusted</p>
                <p className="text-lg md:text-2xl font-bold">
                  {adjustedStats.mean.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Improvement</p>
                <p className="text-lg md:text-2xl font-bold">
                  {(baselineStats.mean - adjustedStats.mean).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">At Risk (M)</p>
                <p className="text-lg md:text-2xl font-bold">{totalExposedUnhealthy}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Population Exposure Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg">Population Exposure by AQI Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exposureData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="category" stroke="#888" fontSize={10} />
                <YAxis
                  stroke="#888"
                  fontSize={10}
                  label={{
                    value: "Population (M)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#888", fontSize: 10 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string, props: { payload: { fullCategory: string } }) => [
                    `${value}M people`,
                    props.payload.fullCategory,
                  ]}
                />
                <Bar dataKey="population" radius={[4, 4, 0, 0]}>
                  {exposureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Tables */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">Baseline Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Mean</td>
                    <td className="py-2 text-right font-medium">
                      {baselineStats.mean.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Median</td>
                    <td className="py-2 text-right font-medium">
                      {baselineStats.median.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Std Dev</td>
                    <td className="py-2 text-right font-medium">
                      {baselineStats.std.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Min</td>
                    <td className="py-2 text-right font-medium">
                      {baselineStats.min.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Max</td>
                    <td className="py-2 text-right font-medium">
                      {baselineStats.max.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">IQR</td>
                    <td className="py-2 text-right font-medium">
                      {baselineStats.q25.toFixed(2)} - {baselineStats.q75.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">Adjusted Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Mean</td>
                    <td className="py-2 text-right font-medium">
                      {adjustedStats.mean.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Median</td>
                    <td className="py-2 text-right font-medium">
                      {adjustedStats.median.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Std Dev</td>
                    <td className="py-2 text-right font-medium">
                      {adjustedStats.std.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Min</td>
                    <td className="py-2 text-right font-medium">
                      {adjustedStats.min.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Max</td>
                    <td className="py-2 text-right font-medium">
                      {adjustedStats.max.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">IQR</td>
                    <td className="py-2 text-right font-medium">
                      {adjustedStats.q25.toFixed(2)} - {adjustedStats.q75.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* City Details Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg">City-wise Population Exposure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <table className="w-full text-xs md:text-sm min-w-[400px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium">City</th>
                  <th className="text-right py-2 font-medium">Population</th>
                  <th className="text-right py-2 font-medium">AQI</th>
                  <th className="text-left py-2 font-medium pl-4">Category</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => {
                  const aqi = aqiData[city] || 100;
                  const { category, color } = getAqiCategory(aqi);
                  const pop = cityPopulation[city] || 0;
                  return (
                    <tr key={city} className="border-b border-border/50">
                      <td className="py-2 font-medium">{city}</td>
                      <td className="text-right py-2 text-muted-foreground">
                        {(pop / 1000000).toFixed(1)}M
                      </td>
                      <td className="text-right py-2 font-medium">{aqi}</td>
                      <td className="py-2 pl-4">
                        <span
                          className="inline-block px-2 py-0.5 rounded text-xs text-white"
                          style={{ backgroundColor: color }}
                        >
                          {category.split(" ")[0]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
