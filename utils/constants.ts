export const SUN_RADIUS_KM = 695700;
// Server-side only key
export const API_SECRET_KEY = process.env.API_SECRET_KEY || "";
// Client-side accessible key (from next.config.ts env property)
export const PUBLIC_API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

if (typeof window !== "undefined") {
  console.log("Auth configuration:", {
    apiKeyConfigured: !!PUBLIC_API_KEY,
    apiKeyLength: PUBLIC_API_KEY ? PUBLIC_API_KEY.length : 0,
  });
}

export const shouldEnforceAuth = () => {
  const forceAuthTest = process.env.TEST_AUTH === "true";
  
  return (
    (process.env.NODE_ENV === "production" || forceAuthTest) &&
    ((API_SECRET_KEY && API_SECRET_KEY.length > 0) ||
     (PUBLIC_API_KEY && PUBLIC_API_KEY.length > 0))
  );
};

export const API_KEY = {
  server: API_SECRET_KEY,
  client: PUBLIC_API_KEY,
};