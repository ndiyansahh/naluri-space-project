interface CircumferenceDisplayProps {
  circumference: number;
  isLoading: boolean;
}

export function CircumferenceDisplay({
  circumference,
  isLoading,
}: CircumferenceDisplayProps) {
  return (
    <div className="text-center flex flex-col justify-center items-center min-h-[160px]">
      <h1
        className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center
                   min-w-[18ch] whitespace-nowrap"
      >
        {isLoading
          ? "Calculating..."
          : circumference.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
      </h1>

      <p
        className={`text-2xl font-semibold text-gray-600 ${
          isLoading ? "invisible" : "visible"
        }`}
      >
        km
      </p>
    </div>
  );
}
