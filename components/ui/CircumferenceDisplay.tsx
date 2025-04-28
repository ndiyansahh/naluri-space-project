interface CircumferenceDisplayProps {
  circumference: number;
}

export function CircumferenceDisplay({
  circumference,
}: CircumferenceDisplayProps) {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">
        {circumference.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </h1>
      <p className="text-2xl font-semibold text-gray-600">km</p>
    </div>
  );
}
