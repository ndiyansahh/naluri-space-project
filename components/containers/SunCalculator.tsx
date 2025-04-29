"use client";

import { useState } from "react";
import { CircumferenceDisplay } from "@/components/ui/CircumferenceDisplay";
import { CircumferenceButton } from "@/components/ui/CircumferenceButton";
import { useCircumference } from '@/hooks/useCircumference';

export default function SunCalculator() {
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"efficient" | "optimized">("efficient");

  // Custom hook for fetching and caching
  const { data, mutate, fallbackCircumference } = useCircumference(mode);

  // Derive display values
  const piValue = data?.pi ?? '—';
  const iterations = data?.currentIterations ?? 0;
  const circumference = data?.circumference
    ? parseFloat(data.circumference)
    : fallbackCircumference;

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const recalculateCircumference = async () => {
    setIsLoading(true);
    try {
      await mutate();
      showToastMessage(`Successfully recalculated at iteration ${iterations + 1}!`);
    } catch (err) {
      console.error(err);
      showToastMessage("Failed to recalculate");
    } finally {
      setIsLoading(false);
    }
  };

  const resetIterations = async () => {
    setIsLoading(true);
    try {
      await mutate(true);
      showToastMessage("Iterations reset to 0");
    } catch (err) {
      console.error(err);
      showToastMessage("Failed to reset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (selectedMode: "efficient" | "optimized") => {
    setMode(selectedMode);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg">
      <div className="p-8 flex flex-col items-center">
        {toastMessage && (
          <div
            role="status"
            aria-live="polite"
            className={`bg-naluri-teal fixed top-6 right-6 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-500 ease-in-out transform z-50 ${
              showToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            {toastMessage}
          </div>
        )}
        <h1 className="text-2xl font-medium text-teal-800 text-center mb-10">
          Sun Circumference
        </h1>

        <div className="flex justify-center gap-4 w-full mb-6">
          <button
            onClick={() => handleModeChange("efficient")}
            className={`flex-1 px-4 py-2 rounded-lg border font-medium transition ${
              mode === "efficient"
                ? "bg-naluri-teal text-white"
                : "bg-white text-black hover:bg-teal-50"
            }`}
          >
            Efficient
          </button>
          <button
            onClick={() => handleModeChange("optimized")}
            className={`flex-1 px-4 py-2 rounded-lg border font-medium transition ${
              mode === "optimized"
                ? "bg-naluri-teal text-white"
                : "bg-white text-black hover:bg-teal-50"
            }`}
          >
            Optimized
          </button>
        </div>

        <CircumferenceDisplay
          circumference={circumference}
          isLoading={isLoading}
        />

        <div className="flex mb-3 w-full justify-around text-gray-700 text-sm">
          <div className="text-center">
            <p className="font-semibold text-teal-600">Radius</p>
            <p className="font-bold">{fallbackCircumference.toLocaleString()} km</p>
          </div>
          <div className="text-center max-w-[120px]">
            <p className="font-semibold text-teal-600">Pi Value</p>
            <p className="font-bold break-words">{piValue}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-teal-600">Iterations</p>
            <p className="font-bold">{iterations}</p>
          </div>
        </div>

        <div className="flex flex-col w-full gap-4">
          <CircumferenceButton
            onClick={recalculateCircumference}
            isLoading={isLoading}
          />
          <button
            onClick={resetIterations}
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
          >
            Reset Iterations
          </button>
        </div>
      </div>
    </div>
  );
}
