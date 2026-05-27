// Health recommendations for each AQI category
export const healthRecommendations: Record<
  string,
  { general: string; sensitive: string; precautions: string[] }
> = {
  Good: {
    general:
      "Air quality is considered satisfactory, and air pollution poses little or no risk.",
    sensitive: "No precautions needed.",
    precautions: ["No precautions needed.", "Great day for outdoor exercise!"],
  },
  Moderate: {
    general:
      "Air quality is acceptable. Unusually sensitive people should consider limiting activities.",
    sensitive:
      "Sensitive Groups (children, elderly, people with respiratory diseases) should reduce prolonged outdoor activities.",
    precautions: [
      "Limit strenuous outdoor activities",
      "Consider light indoor activities for sensitive groups",
    ],
  },
  "Unhealthy for Sensitive Groups": {
    general: "Members of sensitive groups may experience health effects.",
    sensitive:
      "You should reduce prolonged outdoor exertion. Consider using N95 masks if exposed.",
    precautions: [
      "Reduce outdoor activities",
      "Use N95 masks for outdoor exposure",
      "Keep windows closed",
    ],
  },
  Unhealthy: {
    general: "Everyone may begin to experience health effects.",
    sensitive: "Avoid outdoor activities. Use air purifiers indoors.",
    precautions: [
      "Stay indoors",
      "Close all windows and doors",
      "Use HEPA air filters",
      "Wear N95/N100 masks if outside",
    ],
  },
  "Very Unhealthy": {
    general:
      "Health warning of emergency conditions: the entire population is more likely to be affected.",
    sensitive: "Avoid all outdoor activities. Use hospitals if needed.",
    precautions: [
      "Stay indoors with air filtration",
      "Avoid all outdoor activities",
      "Seek medical help if experiencing symptoms",
    ],
  },
  Hazardous: {
    general: "Health alert: everyone may experience serious health effects.",
    sensitive: "Emergency conditions: Seek medical help immediately.",
    precautions: [
      "Remain indoors",
      "Use industrial air filters",
      "Seek immediate medical attention",
      "Emergency services should be on alert",
    ],
  },
};

// AQI categories with ranges and colors
export const aqiCategories: {
  range: [number, number];
  category: string;
  color: string;
  bgClass: string;
  textClass: string;
}[] = [
  {
    range: [0, 50],
    category: "Good",
    color: "#22c55e",
    bgClass: "bg-aqi-good",
    textClass: "text-aqi-good",
  },
  {
    range: [51, 100],
    category: "Moderate",
    color: "#eab308",
    bgClass: "bg-aqi-moderate",
    textClass: "text-aqi-moderate",
  },
  {
    range: [101, 150],
    category: "Unhealthy for Sensitive Groups",
    color: "#f97316",
    bgClass: "bg-aqi-sensitive",
    textClass: "text-aqi-sensitive",
  },
  {
    range: [151, 200],
    category: "Unhealthy",
    color: "#ef4444",
    bgClass: "bg-aqi-unhealthy",
    textClass: "text-aqi-unhealthy",
  },
  {
    range: [201, 300],
    category: "Very Unhealthy",
    color: "#a855f7",
    bgClass: "bg-aqi-very-unhealthy",
    textClass: "text-aqi-very-unhealthy",
  },
  {
    range: [301, 500],
    category: "Hazardous",
    color: "#7f1d1d",
    bgClass: "bg-aqi-hazardous",
    textClass: "text-aqi-hazardous",
  },
];

// City coordinates for all Indian State Capitals
export const cityCoords: Record<string, { lat: number; lon: number }> = {
  // Union Territories
  Delhi: { lat: 28.6139, lon: 77.209 },
  Chandigarh: { lat: 30.7333, lon: 76.7794 },
  Puducherry: { lat: 12.0657, lon: 79.8711 },
  Lakshadweep: { lat: 10.5667, lon: 72.7417 },
  Ladakh: { lat: 34.1526, lon: 77.5771 },

  // Northern States
  Shimla: { lat: 31.7771, lon: 77.1025 },
  Dehradun: { lat: 30.3165, lon: 78.0322 },
  Lucknow: { lat: 26.8467, lon: 80.9462 },
  Jaipur: { lat: 26.8124, lon: 75.8456 },

  // North-Eastern States
  Dispur: { lat: 26.1445, lon: 91.7362 },
  Itanagar: { lat: 28.218, lon: 93.6053 },
  Imphal: { lat: 24.817, lon: 94.9885 },
  Kohima: { lat: 25.6816, lon: 94.1096 },
  Agartala: { lat: 23.8103, lon: 91.2789 },
  Aizawl: { lat: 23.1815, lon: 92.7879 },
  Gangtok: { lat: 27.533, lon: 88.6006 },
  Shillong: { lat: 25.5788, lon: 91.8933 },

  // Western States
  Mumbai: { lat: 19.076, lon: 72.8777 },
  Gandhinagar: { lat: 23.2156, lon: 72.6369 },
  Panaji: { lat: 15.4909, lon: 73.8278 },

  // Central States
  Bhopal: { lat: 23.1815, lon: 75.7873 },
  Raipur: { lat: 21.2514, lon: 81.6296 },

  // Eastern States
  Patna: { lat: 25.5941, lon: 85.1376 },
  Ranchi: { lat: 23.3441, lon: 85.3096 },
  Bhubaneswar: { lat: 20.2961, lon: 85.8245 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },

  // Southern States
  Bengaluru: { lat: 12.9716, lon: 77.5946 },
  Hyderabad: { lat: 17.385, lon: 78.4867 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Thiruvananthapuram: { lat: 8.5241, lon: 76.9366 },
};

// City population data (approximate)
export const cityPopulation: Record<string, number> = {
  Delhi: 32000000,
  Chandigarh: 1200000,
  Puducherry: 950000,
  Lakshadweep: 65000,
  Ladakh: 300000,
  Shimla: 170000,
  Dehradun: 2100000,
  Lucknow: 3400000,
  Jaipur: 4000000,
  Dispur: 1100000,
  Itanagar: 60000,
  Imphal: 270000,
  Kohima: 100000,
  Agartala: 520000,
  Aizawl: 330000,
  Gangtok: 100000,
  Shillong: 150000,
  Mumbai: 21000000,
  Gandhinagar: 300000,
  Panaji: 115000,
  Bhopal: 2500000,
  Raipur: 1100000,
  Patna: 2500000,
  Ranchi: 1500000,
  Bhubaneswar: 1100000,
  Kolkata: 15000000,
  Bengaluru: 13000000,
  Hyderabad: 10000000,
  Chennai: 11000000,
  Thiruvananthapuram: 950000,
};

// Mock AQI data for demonstration
export const mockAqiData: Record<string, number> = {
  // Union Territories
  Delhi: 285,
  Chandigarh: 145,
  Puducherry: 95,
  Lakshadweep: 45,
  Ladakh: 65,

  // Northern States
  Shimla: 85,
  Dehradun: 165,
  Lucknow: 215,
  Jaipur: 195,

  // North-Eastern States
  Dispur: 105,
  Itanagar: 75,
  Imphal: 85,
  Kohima: 65,
  Agartala: 95,
  Aizawl: 55,
  Gangtok: 45,
  Shillong: 75,

  // Western States
  Mumbai: 165,
  Gandhinagar: 155,
  Panaji: 72,

  // Central States
  Bhopal: 142,
  Raipur: 128,

  // Eastern States
  Patna: 198,
  Ranchi: 135,
  Bhubaneswar: 112,
  Kolkata: 178,

  // Southern States
  Bengaluru: 125,
  Hyderabad: 138,
  Chennai: 98,
  Thiruvananthapuram: 62,
};

// Pollutant information
export const pollutantInfo: Record<
  string,
  { range: [number, number]; unit: string; badThreshold: number }
> = {
  "PM2.5": { range: [0, 500], unit: "ug/m3", badThreshold: 35 },
  PM10: { range: [0, 500], unit: "ug/m3", badThreshold: 75 },
  NO2: { range: [0, 1000], unit: "ppb", badThreshold: 100 },
  SO2: { range: [0, 1000], unit: "ppb", badThreshold: 75 },
  O3: { range: [0, 500], unit: "ppb", badThreshold: 70 },
  CO: { range: [0, 50], unit: "ppm", badThreshold: 4 },
};

// Helper functions
export function getAqiCategory(aqi: number): {
  category: string;
  color: string;
  bgClass: string;
  textClass: string;
} {
  for (const cat of aqiCategories) {
    if (aqi >= cat.range[0] && aqi <= cat.range[1]) {
      return {
        category: cat.category,
        color: cat.color,
        bgClass: cat.bgClass,
        textClass: cat.textClass,
      };
    }
  }
  return {
    category: "Hazardous",
    color: "#7f1d1d",
    bgClass: "bg-aqi-hazardous",
    textClass: "text-aqi-hazardous",
  };
}

export function generatePollutantData(
  aqiValue: number
): Record<string, number> {
  const factor = aqiValue / 150;
  return {
    "PM2.5": Math.min(100 * factor, 500),
    PM10: Math.min(150 * factor, 500),
    NO2: Math.min(80 * factor, 1000),
    SO2: Math.min(60 * factor, 1000),
    O3: Math.min(70 * factor, 500),
    CO: Math.min(3 * factor, 50),
  };
}

// Seeded random for consistent SSR/hydration
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateForecast(
  baseAqi: number,
  days: number
): { baseline: number[]; adjusted: number[] } {
  const baseline = Array.from(
    { length: days },
    (_, i) => baseAqi * (1 - 0.02 * i) + (seededRandom(baseAqi + i) * 20 - 10)
  );
  const adjusted = baseline.map((v) => v * 0.8);
  return { baseline, adjusted };
}

export function calculateStatistics(data: number[]): {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  q25: number;
  q75: number;
} {
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
  const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance);
  const min = sorted[0];
  const max = sorted[n - 1];
  const q25 = sorted[Math.floor(n * 0.25)];
  const q75 = sorted[Math.floor(n * 0.75)];

  return { mean, median, std, min, max, q25, q75 };
}

// Default selected cities
export const defaultCities = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Kolkata",
  "Chennai",
];
