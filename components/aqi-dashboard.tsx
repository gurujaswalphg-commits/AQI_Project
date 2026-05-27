"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AqiCard } from "@/components/aqi-card";
import { PolicyControls } from "@/components/policy-controls";
import { HealthRecommendations } from "@/components/health-recommendations";
import { ForecastChart } from "@/components/charts/forecast-chart";
import { RankingChart } from "@/components/charts/ranking-chart";
import { PollutantChart } from "@/components/charts/pollutant-chart";
import { StatisticsView } from "@/components/charts/statistics-view";
import {
  mockAqiData,
  cityCoords,
  defaultCities,
  generateForecast,
  getAqiCategory,
} from "@/lib/aqi-data";
import {
  Wind,
  TrendingUp,
  Heart,
  Trophy,
  BarChart3,
  Microscope,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AqiDashboard() {
  // City selection state
  const [selectedCities, setSelectedCities] = useState<string[]>(defaultCities);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Policy simulation state
  const [trafficReduction, setTrafficReduction] = useState(20);
  const [industryReduction, setIndustryReduction] = useState(10);
  const [constructionReduction, setConstructionReduction] = useState(15);
  const [householdReduction, setHouseholdReduction] = useState(10);
  const [greenCoverIncrease, setGreenCoverIncrease] = useState(20);

  // Forecast settings
  const [forecastDays] = useState(10);

  // Selected city for detailed views
  const [selectedCity, setSelectedCity] = useState(selectedCities[0] || "Delhi");

  // Calculate policy impact
  const policyFactor = useMemo(() => {
    const trafficFactor = 0.4 * (trafficReduction / 100);
    const industryFactor = 0.3 * (industryReduction / 100);
    const constructionFactor = 0.15 * (constructionReduction / 100);
    const householdFactor = 0.1 * (householdReduction / 100);
    const greenFactor = -0.2 * (greenCoverIncrease / 100);
    return (
      trafficFactor +
      industryFactor +
      constructionFactor +
      householdFactor +
      greenFactor
    );
  }, [
    trafficReduction,
    industryReduction,
    constructionReduction,
    householdReduction,
    greenCoverIncrease,
  ]);

  // Generate forecast data for selected cities
  const forecastData = useMemo(() => {
    return selectedCities.map((city) => {
      const baseAqi = mockAqiData[city] || 100;
      const { baseline, adjusted: rawAdjusted } = generateForecast(
        baseAqi,
        forecastDays
      );
      const adjusted = baseline.map((v) => v * (1 - policyFactor));
      return {
        city,
        baseline,
        adjusted,
        currentAqi: baseAqi,
        avgBaseline: baseline.reduce((a, b) => a + b, 0) / baseline.length,
        avgAdjusted: adjusted.reduce((a, b) => a + b, 0) / adjusted.length,
      };
    });
  }, [selectedCities, forecastDays, policyFactor]);

  // Ranking data
  const rankingData = useMemo(() => {
    return forecastData
      .map((d) => ({
        city: d.city,
        currentAqi: d.currentAqi,
        avgBaseline: Math.round(d.avgBaseline * 100) / 100,
        avgAdjusted: Math.round(d.avgAdjusted * 100) / 100,
        improvement: Math.round((d.avgBaseline - d.avgAdjusted) * 100) / 100,
        improvementPct:
          Math.round(
            ((d.avgBaseline - d.avgAdjusted) / d.avgBaseline) * 1000
          ) / 10,
      }))
      .sort((a, b) => a.avgAdjusted - b.avgAdjusted);
  }, [forecastData]);

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const allCities = Object.keys(cityCoords).sort();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <Wind className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                AQI Dashboard
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Air Quality Analysis for {Object.keys(cityCoords).length} Indian
                Cities
              </p>
            </div>

            {/* City selector dropdown */}
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-accent transition-colors w-full md:w-auto"
              >
                <span className="truncate">
                  {selectedCities.length} cities selected
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform flex-shrink-0",
                    cityDropdownOpen && "rotate-180"
                  )}
                />
              </button>
              {cityDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 max-h-64 overflow-auto rounded-lg border border-border bg-card shadow-lg z-50">
                  <div className="p-2">
                    {allCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => toggleCity(city)}
                        className="flex items-center gap-2 w-full rounded px-2 py-1.5 text-sm hover:bg-accent transition-colors text-left"
                      >
                        <div
                          className={cn(
                            "h-4 w-4 rounded border flex items-center justify-center flex-shrink-0",
                            selectedCities.includes(city)
                              ? "bg-primary border-primary"
                              : "border-border"
                          )}
                        >
                          {selectedCities.includes(city) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <span className="truncate">{city}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-6">
        <div className="grid gap-4 md:gap-6 lg:grid-cols-[1fr_280px]">
          {/* Main Content */}
          <div className="space-y-4 md:space-y-6">
            {/* Current AQI Cards */}
            <div>
              <h2 className="text-base md:text-lg font-semibold mb-3">Current AQI Status</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
                {selectedCities.map((city) => (
                  <AqiCard
                    key={city}
                    city={city}
                    aqi={mockAqiData[city] || 100}
                  />
                ))}
              </div>
            </div>

            {/* Tabs for different views */}
            <Tabs defaultValue="forecasts" className="w-full">
              <TabsList className="w-full flex flex-wrap justify-start">
                <TabsTrigger value="forecasts" className="flex items-center gap-1 text-xs md:text-sm">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Forecasts</span>
                </TabsTrigger>
                <TabsTrigger value="health" className="flex items-center gap-1 text-xs md:text-sm">
                  <Heart className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Health</span>
                </TabsTrigger>
                <TabsTrigger value="rankings" className="flex items-center gap-1 text-xs md:text-sm">
                  <Trophy className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Rankings</span>
                </TabsTrigger>
                <TabsTrigger value="statistics" className="flex items-center gap-1 text-xs md:text-sm">
                  <BarChart3 className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Statistics</span>
                </TabsTrigger>
                <TabsTrigger value="pollutants" className="flex items-center gap-1 text-xs md:text-sm">
                  <Microscope className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Pollutants</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="forecasts">
                <div className="space-y-4 md:space-y-6">
                  <ForecastChart
                    data={forecastData}
                    forecastDays={forecastDays}
                  />

                  {/* Forecast Table */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base md:text-lg">Detailed Forecast</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                        <table className="w-full text-xs md:text-sm min-w-[500px]">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 font-medium">City</th>
                              <th className="text-right py-2 font-medium">
                                Current
                              </th>
                              <th className="text-right py-2 font-medium">
                                Avg Baseline
                              </th>
                              <th className="text-right py-2 font-medium">
                                Avg Adjusted
                              </th>
                              <th className="text-right py-2 font-medium">
                                Improvement
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rankingData.map((row) => (
                              <tr
                                key={row.city}
                                className="border-b border-border/50"
                              >
                                <td className="py-2 font-medium">{row.city}</td>
                                <td className="text-right py-2">
                                  <span
                                    className="inline-block px-2 py-0.5 rounded text-xs text-white"
                                    style={{
                                      backgroundColor: getAqiCategory(
                                        row.currentAqi
                                      ).color,
                                    }}
                                  >
                                    {row.currentAqi}
                                  </span>
                                </td>
                                <td className="text-right py-2 text-muted-foreground">
                                  {row.avgBaseline}
                                </td>
                                <td className="text-right py-2 text-muted-foreground">
                                  {row.avgAdjusted}
                                </td>
                                <td className="text-right py-2 text-green-500">
                                  {row.improvementPct}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="health">
                <HealthRecommendations
                  cities={selectedCities}
                  aqiData={mockAqiData}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                />
              </TabsContent>

              <TabsContent value="rankings">
                <div className="space-y-4 md:space-y-6">
                  <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base md:text-lg text-green-500">
                          Cleanest Cities
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {rankingData.slice(0, 5).map((city, idx) => (
                            <div
                              key={city.city}
                              className="flex items-center justify-between rounded-lg bg-secondary p-2 md:p-3"
                            >
                              <div className="flex items-center gap-2 md:gap-3">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                  {idx + 1}
                                </span>
                                <span className="font-medium text-sm">{city.city}</span>
                              </div>
                              <span
                                className="rounded px-2 py-1 text-xs text-white"
                                style={{
                                  backgroundColor: getAqiCategory(
                                    city.avgAdjusted
                                  ).color,
                                }}
                              >
                                {city.avgAdjusted}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base md:text-lg text-red-500">
                          Most Polluted Cities
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {[...rankingData]
                            .reverse()
                            .slice(0, 5)
                            .map((city, idx) => (
                              <div
                                key={city.city}
                                className="flex items-center justify-between rounded-lg bg-secondary p-2 md:p-3"
                              >
                                <div className="flex items-center gap-2 md:gap-3">
                                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white">
                                    {idx + 1}
                                  </span>
                                  <span className="font-medium text-sm">{city.city}</span>
                                </div>
                                <span
                                  className="rounded px-2 py-1 text-xs text-white"
                                  style={{
                                    backgroundColor: getAqiCategory(
                                      city.avgAdjusted
                                    ).color,
                                  }}
                                >
                                  {city.avgAdjusted}
                                </span>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <RankingChart data={rankingData} />
                </div>
              </TabsContent>

              <TabsContent value="statistics">
                <StatisticsView
                  cities={selectedCities}
                  aqiData={mockAqiData}
                  forecastData={forecastData}
                />
              </TabsContent>

              <TabsContent value="pollutants">
                <PollutantChart
                  cities={selectedCities}
                  aqiData={mockAqiData}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Policy Controls */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <PolicyControls
              trafficReduction={trafficReduction}
              setTrafficReduction={setTrafficReduction}
              industryReduction={industryReduction}
              setIndustryReduction={setIndustryReduction}
              constructionReduction={constructionReduction}
              setConstructionReduction={setConstructionReduction}
              householdReduction={householdReduction}
              setHouseholdReduction={setHouseholdReduction}
              greenCoverIncrease={greenCoverIncrease}
              setGreenCoverIncrease={setGreenCoverIncrease}
            />

            {/* Policy Impact Summary */}
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm md:text-base">Policy Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary">
                    {Math.round(policyFactor * 1000) / 10}%
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    Expected AQI Reduction
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-4 md:py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-xs md:text-sm text-muted-foreground">
            <p>AQI Dashboard - Air Quality Index Analysis</p>
            <p className="mt-1">
              Data based on EPA standards (0-500 scale) | Policy simulation
              shows potential impact of emission reduction measures
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
