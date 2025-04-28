import { RefreshCw, Loader2 } from "lucide-react";

interface CircumferenceButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function CircumferenceButton({
  onClick,
  isLoading,
}: CircumferenceButtonProps) {
  return (
    <>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <RefreshCw className="w-5 h-5" />
        )}
        {isLoading ? "Calculating..." : "Recalculate Circumference"}
      </button>
      <p className="text-sm text-gray-500 text-center">Formula: 2 × π × r</p>
    </>
  );
}
