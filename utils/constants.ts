export const SUN_RADIUS_KM = 695700;
export const API_SECRET_KEY = process.env.NEXT_PUBLIC_API_SECRET_KEY || process.env.API_SECRET_KEY || "";
export const PUBLIC_API_KEY = process.env.NEXT_PUBLIC_PUBLIC_API_SECRET_KEY || process.env.PUBLIC_API_SECRET_KEY || "";

if (typeof window !== 'undefined') {
  console.log('API Keys configured:', {
    hasApiSecretKey: !!API_SECRET_KEY,
    hasPublicApiKey: !!PUBLIC_API_KEY,
  });
}
