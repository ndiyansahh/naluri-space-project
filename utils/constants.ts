export const SUN_RADIUS_KM = 695700;
const SHARED_API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

export const API_KEY = {
  server: SHARED_API_KEY,
  client: SHARED_API_KEY,
};

if (typeof window !== "undefined") {
  console.log("Auth configuration:", {
    apiKeyConfigured: !!API_KEY.client,
    apiKeyLength: API_KEY.client ? API_KEY.client.length : 0,
  });
}
export const shouldEnforceAuth = () => {
  return (
    process.env.NODE_ENV === "production" &&
    API_KEY.server &&
    API_KEY.server.length > 0
  );
};
