import useSWR from "swr";
import { PUBLIC_API_KEY, SUN_RADIUS_KM } from "@/utils/constants";

const fetcher = async (url: string) => {
  const headers: HeadersInit = {};
  if (PUBLIC_API_KEY) {
    headers.Authorization = `Bearer ${PUBLIC_API_KEY}`;
  }
  
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`API Error (${res.status}):`, errorText);
    throw new Error(`Network error: ${res.status}`);
  }
  return res.json();
};

interface CircumferenceData {
  pi: string;
  currentIterations: number;
  circumference: string;
  reset?: boolean;
}

export function useCircumference(mode: "efficient" | "optimized") {
  const key = `/api/circumference?mode=${mode}&increment=false`;

  const { data, error, mutate } = useSWR<CircumferenceData>(key, fetcher, {
    dedupingInterval: 60000,
    revalidateOnFocus: false,
    onError: (err) => console.error("useCircumference error:", err),
  });

  const fallbackCircumference = 2 * 3.14 * SUN_RADIUS_KM;

  return {
    data: data
      ? {
          pi: data.pi,
          currentIterations: data.currentIterations,
          circumference: data.circumference,
          radius: SUN_RADIUS_KM,
        }
      : undefined,
    error,
    isLoading: !data && !error,
    mutate: (reset?: boolean) =>
      mutate(
        async () => {
          const url = reset
            ? `/api/circumference?mode=${mode}&reset=true`
            : `/api/circumference?mode=${mode}&increment=true`;
          return fetcher(url);
        },
        { revalidate: !reset }
      ),
    fallbackCircumference,
  };
}