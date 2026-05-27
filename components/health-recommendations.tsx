"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { healthRecommendations, getAqiCategory } from "@/lib/aqi-data";
import {
  Heart,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface HealthRecommendationsProps {
  cities: string[];
  aqiData: Record<string, number>;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export function HealthRecommendations({
  cities,
  aqiData,
  selectedCity,
  setSelectedCity,
}: HealthRecommendationsProps) {
  const aqi = aqiData[selectedCity] || 100;
  const { category, color } = getAqiCategory(aqi);
  const recommendations = healthRecommendations[category];

  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Heart className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            Health Guidance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div
            className="rounded-lg p-3 md:p-4 text-white"
            style={{ backgroundColor: color }}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm md:text-base">{selectedCity}</span>
              <span className="text-xl md:text-2xl font-bold">{aqi}</span>
            </div>
            <p className="text-xs md:text-sm opacity-90 mt-1">{category}</p>
          </div>

          {recommendations && (
            <div className="space-y-4">
              <div className="rounded-lg bg-secondary p-3 md:p-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm md:text-base">General Population</h4>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      {recommendations.general}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-secondary p-3 md:p-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <ShieldAlert className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm md:text-base">Sensitive Groups</h4>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      {recommendations.sensitive}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-secondary p-3 md:p-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm md:text-base">Precautions</h4>
                    <ul className="text-xs md:text-sm text-muted-foreground mt-1 space-y-1">
                      {recommendations.precautions.map((p, i) => (
                        <li key={i}>- {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg">AQI Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <table className="w-full text-xs md:text-sm min-w-[400px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium">Range</th>
                  <th className="text-left py-2 font-medium">Category</th>
                  <th className="text-left py-2 font-medium">Health Effect</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-2">0-50</td>
                  <td className="py-2 text-green-500">Good</td>
                  <td className="py-2 text-muted-foreground">No health risks</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">51-100</td>
                  <td className="py-2 text-yellow-500">Moderate</td>
                  <td className="py-2 text-muted-foreground">Acceptable</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">101-150</td>
                  <td className="py-2 text-orange-500">Sensitive</td>
                  <td className="py-2 text-muted-foreground">Sensitive at risk</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">151-200</td>
                  <td className="py-2 text-red-500">Unhealthy</td>
                  <td className="py-2 text-muted-foreground">General at risk</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">201-300</td>
                  <td className="py-2 text-purple-500">Very Unhealthy</td>
                  <td className="py-2 text-muted-foreground">High risk for all</td>
                </tr>
                <tr>
                  <td className="py-2">301-500</td>
                  <td className="py-2 text-red-900">Hazardous</td>
                  <td className="py-2 text-muted-foreground">Emergency</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
