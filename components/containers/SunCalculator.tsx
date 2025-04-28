"use client";

import { useState } from "react";
import { CircumferenceDisplay } from "@/components/ui/CircumferenceDisplay";
import { CircumferenceFormula } from "@/components/ui/CircumferenceFormula";
import { CircumferenceButton } from "@/components/ui/CircumferenceButton";

export default function SunCalculator() {
  const [piValue, setPiValue] = useState("3.14");
  const [circumference, setCircumference] = useState<number>(2 * 3.14 * 695700);
  const [isLoading, setIsLoading] = useState(false);

  const radius = 695700;

  const generatePi = () => {
    const randomDigits = Array.from({ length: 18 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    return `3.${randomDigits}`;
  };

  const recalculateCircumference = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newPi = generatePi();
      const calculatedCircumference = 2 * parseFloat(newPi) * radius;
      setPiValue(newPi);
      setCircumference(calculatedCircumference);
      setIsLoading(false);
    }, 1000); // Simulasi loading 1 detik
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
      <h2 className="text-sm font-medium text-teal-600 text-center">
        Sun Circumference
      </h2>

      <CircumferenceDisplay circumference={circumference} />
      <CircumferenceFormula radius={radius} pi={piValue} />
      <CircumferenceButton
        onClick={recalculateCircumference}
        isLoading={isLoading}
      />
    </div>
  );
}
