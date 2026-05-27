"use client";

import { getAqiCategory } from "@/lib/aqi-data";
import { cn } from "@/lib/utils";

interface AqiCardProps {
  city: string;
  aqi: number;
  className?: string;
}

export function AqiCard({ city, aqi, className }: AqiCardProps) {
  const { category, color } = getAqiCategory(aqi);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:shadow-lg hover:scale-[1.02]",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundColor: color }}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base md:text-lg truncate">{city}</h3>
          <div
            className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full text-white text-xs md:text-sm font-bold"
            style={{ backgroundColor: color }}
          >
            {aqi}
          </div>
        </div>
        <div className="mt-2">
          <span
            className="inline-block rounded-full px-2 py-1 text-xs font-medium text-white"
            style={{ backgroundColor: color }}
          >
            {category}
          </span>
        </div>
      </div>
    </div>
  );
}
