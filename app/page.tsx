'use client';

import { useState, useEffect } from 'react';

interface CircumferenceData {
  pi: string;
  circumference: string;
}

export default function Home() {
  const [data, setData] = useState<CircumferenceData>({ pi: '', circumference: '' });

  const fetchCircumference = async () => {
    const res = await fetch('/api/circumference');
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchCircumference();
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow flex flex-col items-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Sun Circumference</h1>

        <div className="flex items-baseline text-yellow-500 mb-6">
          <span className="text-5xl font-extrabold">
            {data.circumference ? data.circumference.split(' ')[0] : '-'}
          </span>
          <span className="ml-2 text-2xl font-bold">km</span>
        </div>

        <div className="text-center text-sm text-gray-600 space-y-1 mb-4">
          <p>Radius (r): 695,700 km</p>
          <p>Pi (π): {data.pi || '-'}</p>
          <p className="mt-2 text-xs">Formula: 2 × π × r</p>
        </div>

        <button
          onClick={fetchCircumference}
          className="mt-4 px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
        >
          Recalculate Circumference
        </button>
      </div>
    </main>
  );
}
