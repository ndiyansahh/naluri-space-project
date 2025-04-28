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
        disabled={isLoading}
        className={`group w-full flex items-center justify-center  bg-naluri-teal gap-2 px-6 py-4 text-lg font-semibold rounded-lg  hover:bg-white-600 text-white transition-all disabled:opacity-50 min-h-[60px]`}
        style={{ minWidth: "280px" }}
      >
        <span className="flex items-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Calculating...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />

              <span>Recalculate Circumference</span>
            </>
          )}
        </span>
      </button>
      <p className="text-sm text-gray-500 text-center mt-2">
        Formula: 2 × π × r
      </p>
    </>
  );
}
