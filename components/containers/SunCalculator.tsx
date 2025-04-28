"use client";

import { useState } from "react";
import { CircumferenceDisplay } from "@/components/ui/CircumferenceDisplay";
import { CircumferenceButton } from "@/components/ui/CircumferenceButton";
import { SUN_RADIUS_KM } from '@/utils/constants';

export default function SunCalculator() {
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [piValue, setPiValue] = useState("3.14");
  const [circumference, setCircumference] = useState<number>(2 * 3.14 * 695700);
  const [iterations, setIterations] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"efficient" | "optimized">("efficient");

  const radius = SUN_RADIUS_KM;

  const recalculateCircumference = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/circumference?mode=${mode}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      setPiValue(data.pi);
      setIterations(data.currentIterations);
      setCircumference(parseFloat(data.circumference));

      setToastMessage(
        `Successfully recalculated at iteration ${data.currentIterations}!`
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to recalculate");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      setTimeout(() => setToastMessage(""), 3000);
    }
    setIsLoading(false);
  };

  const resetIterations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/circumference?mode=${mode}&reset=true`);
      if (!res.ok) throw new Error("Failed to reset");
      const data = await res.json();

      setPiValue(data.pi);
      setIterations(data.currentIterations);
      setCircumference(parseFloat(data.circumference));

      setToastMessage("Iterations reset to 0");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to reset");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      setTimeout(() => setToastMessage(""), 3000);
    }
    setIsLoading(false);
  };

  const handleModeChange = async (selectedMode: "efficient" | "optimized") => {
    setIsLoading(true);
    setMode(selectedMode);

    const resp = await fetch(
      `/api/circumference?mode=${selectedMode}&debug=true`
    );
    const data = (await resp.json()) as {
      store: Record<string, { pi: string; precision: number }>;
    };

    const entry = data.store[selectedMode];
    setPiValue(entry.pi);
    setIterations(entry.precision);
    setCircumference(2 * parseFloat(entry.pi) * radius);

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg">
      <div className="p-8 flex flex-col items-center">
        {/* Toast */}
        {toastMessage && (
          <div
            role="status"
            aria-live="polite"
            className={` bg-naluri-teal fixed top-6 right-6 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-500 ease-in-out transform z-50 ${
              showToast
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            {toastMessage}
          </div>
        )}
        <h1 className="text-2xl font-medium  text-teal-800 text-center mb-10">
          Sun Circumference
        </h1>

        <div className="flex justify-center gap-4 w-full">
          <button
            onClick={() => handleModeChange("efficient")}
            className={`flex-1 px-4 py-2 rounded-lg border font-medium transition ${
              mode === "efficient"
                ? "bg-naluri-teal text-white bg-naluri-teal hover:bg-naluri-teal"
                : "bg-white text-black hover:bg-teal-50"
            }`}
          >
            Efficient
          </button>
          <button
            onClick={() => handleModeChange("optimized")}
            className={`flex-1 px-4 py-2 rounded-lg border font-medium transition ${
              mode === "optimized"
                ? "bg-naluri-teal text-white bg-naluri-teal bg-naluri-teal"
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
            <p className="font-bold">{radius.toLocaleString()} km</p>
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
            aria-busy={isLoading}
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
