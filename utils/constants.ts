export const SUN_RADIUS_KM = 695700;
export const API_KEY = {
  server: process.env.API_SECRET_KEY || "",
  client: process.env.NEXT_PUBLIC_API_KEY || ""
};

if (typeof window !== 'undefined') {
  console.log('Auth configuration:', {
    clientKeyConfigured: !!API_KEY.client,
    clientKeyLength: API_KEY.client ? API_KEY.client.length : 0
  });
}

export const shouldEnforceAuth = () => {
  return process.env.NODE_ENV === 'production' && 
         API_KEY.server && 
         API_KEY.server.length > 0;
};
