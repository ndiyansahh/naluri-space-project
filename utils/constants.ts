export const SUN_RADIUS_KM = 695700;
export const API_SECRET_KEY = process.env.API_SECRET_KEY || "";
export const PUBLIC_API_KEY = process.env.PUBLIC_API_SECRET_KEY || "";

if (typeof window !== "undefined") {
  console.log("Auth configuration:", {
    apiKeyConfigured: !!PUBLIC_API_KEY,
    apiKeyLength: PUBLIC_API_KEY ? PUBLIC_API_KEY.length : 0,
  });
}

export const shouldEnforceAuth = () => {
  return (
    process.env.NODE_ENV === "production" &&
    API_SECRET_KEY &&
    API_SECRET_KEY.length > 0
  );
};

export const API_KEY = {
  server: API_SECRET_KEY,
  client: PUBLIC_API_KEY,
};