"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface PolicyControlsProps {
  trafficReduction: number;
  setTrafficReduction: (value: number) => void;
  industryReduction: number;
  setIndustryReduction: (value: number) => void;
  constructionReduction: number;
  setConstructionReduction: (value: number) => void;
  householdReduction: number;
  setHouseholdReduction: (value: number) => void;
  greenCoverIncrease: number;
  setGreenCoverIncrease: (value: number) => void;
}

export function PolicyControls({
  trafficReduction,
  setTrafficReduction,
  industryReduction,
  setIndustryReduction,
  constructionReduction,
  setConstructionReduction,
  householdReduction,
  setHouseholdReduction,
  greenCoverIncrease,
  setGreenCoverIncrease,
}: PolicyControlsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg">Policy Simulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        <Slider
          label="Traffic Reduction"
          value={trafficReduction}
          onValueChange={setTrafficReduction}
          min={0}
          max={50}
        />
        <Slider
          label="Industrial Emission"
          value={industryReduction}
          onValueChange={setIndustryReduction}
          min={0}
          max={50}
        />
        <Slider
          label="Construction Dust"
          value={constructionReduction}
          onValueChange={setConstructionReduction}
          min={0}
          max={50}
        />
        <Slider
          label="Household Emission"
          value={householdReduction}
          onValueChange={setHouseholdReduction}
          min={0}
          max={50}
        />
        <Slider
          label="Green Cover Increase"
          value={greenCoverIncrease}
          onValueChange={setGreenCoverIncrease}
          min={0}
          max={50}
        />
      </CardContent>
    </Card>
  );
}
