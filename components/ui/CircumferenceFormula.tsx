interface CircumferenceFormulaProps {
  radius: number;
  pi: string;
}

export function CircumferenceFormula({
  radius,
  pi,
}: CircumferenceFormulaProps) {
  return (
    <div className="flex justify-between items-center text-gray-700 text-lg mt-4">
      <div className="text-center">
        <p className="text-teal-600 font-semibold">Radius</p>
        <p className="font-bold">{radius.toLocaleString()} km</p>
      </div>
      <div className="text-center">
        <p className="text-teal-600 font-semibold">Pi Value</p>
        <p className="font-bold">{pi}</p>
      </div>
    </div>
  );
}
