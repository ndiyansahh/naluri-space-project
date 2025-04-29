import useSWR from "swr";
import { SUN_RADIUS_KM, PUBLIC_API_KEY } from "@/utils/constants";

const fetcher = async (url: string) => {
  try {
    const headers: HeadersInit = {};
    
    // Use the correct environment variable name
    if (PUBLIC_API_KEY && PUBLIC_API_KEY.length > 0) {
      headers.Authorization = `Bearer ${PUBLIC_API_KEY}`;
      console.log('Adding auth header');
    } else {
      console.log('No auth');
    }
    
    const res = await fetch(url, { headers });
    
    if (!res.ok) {
      // Detailed error handling
      const status = res.status;
      let errorMessage;
      
      try {
        // Try to get JSON error message
        const errorJson = await res.json();
        errorMessage = errorJson.error || 'Unknown error';
      } catch (e) {
        // If not JSON, get text error
        errorMessage = await res.text();
      }
      
      console.error(`API Error (${status}):`, errorMessage);
      
      // Special case for auth errors
      if (status === 401) {
        console.error('Authentication failed');
      }
      
      throw new Error(`Network error: ${status} - ${errorMessage}`);
    }
    
    return res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
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
    errorRetryCount: 3,
    errorRetryInterval: 1000
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