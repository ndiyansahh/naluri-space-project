import type { NextApiRequest, NextApiResponse } from "next";
import Big from "big.js";
import { calculatePiEfficient } from "@/utils/pi-efficient";
import { calculatePiOptimized } from "@/utils/pi-optimized";
import {
  SUN_RADIUS_KM,
  API_SECRET_KEY,
  PUBLIC_API_KEY,
  shouldEnforceAuth,
} from "@/utils/constants";

type StoreEntry = { pi: Big; precision: number };

const piStore: Record<"efficient" | "optimized", StoreEntry> = {
  efficient: { pi: new Big(3), precision: 0 },
  optimized: { pi: new Big(3), precision: 0 },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { mode: rawMode, reset, debug, increment } = req.query;

  // debug endpoint
  if (debug === "true" && process.env.NODE_ENV !== "production") {
    return res.status(200).json({
      store: {
        efficient: {
          precision: piStore.efficient.precision,
          pi: piStore.efficient.pi.toString(),
        },
        optimized: {
          precision: piStore.optimized.precision,
          pi: piStore.optimized.pi.toString(),
        },
      },
    });
  }

  const isDirectApiAccess =
    !req.headers.referer ||
    !req.headers.referer.includes(req.headers.host as string);

  /* This comment prevents ESLint from complaining about the unused variable
  // testing debug information when didnt get auth
  console.log('Debug info:', {
    isDirectApiAccess,
    shouldEnforceAuth: shouldEnforceAuth(),
    NODE_ENV: process.env.NODE_ENV,
    TEST_AUTH: process.env.TEST_AUTH,
    hasAPISecretKey: !!API_SECRET_KEY,
    apiSecretKeyLength: API_SECRET_KEY ? API_SECRET_KEY.length : 0,
    hasPublicAPIKey: !!PUBLIC_API_KEY,
    publicAPIKeyLength: PUBLIC_API_KEY ? PUBLIC_API_KEY.length : 0,
    authHeader: req.headers['authorization'] ? 'present' : 'missing',
    authHeaderLength: req.headers['authorization'] ? req.headers['authorization'].length : 0
  });
  */

  // Only check auth for non-direct API access
  if (!isDirectApiAccess && shouldEnforceAuth()) {
    const authHeader = req.headers["authorization"];
    const expectedAuthPrivate = `Bearer ${API_SECRET_KEY}`;
    const expectedAuthPublic = `Bearer ${PUBLIC_API_KEY}`;

    console.log("Auth check:", {
      expectedPrivateLength: expectedAuthPrivate.length,
      expectedPublicLength: expectedAuthPublic.length,
      headerLength: authHeader ? authHeader.length : 0,
      matchesPrivate: authHeader === expectedAuthPrivate,
      matchesPublic: authHeader === expectedAuthPublic,
    });

    if (
      !authHeader ||
      (authHeader !== expectedAuthPrivate && authHeader !== expectedAuthPublic)
    ) {
      console.log(
        `Auth failed: Header ${
          authHeader ? "present" : "missing"
        }, server key ${
          API_SECRET_KEY ? "configured" : "not configured"
        }, public key ${PUBLIC_API_KEY ? "configured" : "not configured"}`
      );
      return res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    console.log("Auth bypassed:", {
      isDirect: isDirectApiAccess,
      environment: process.env.NODE_ENV,
      keyConfigured: !!API_SECRET_KEY,
    });
  }

  const mode = rawMode === "optimized" ? "optimized" : "efficient";
  if (rawMode && mode !== rawMode) {
    return res.status(400).json({ error: `Invalid mode: ${rawMode}` });
  }

  const store = piStore[mode];

  // Handle reset request
  if (reset === "true") {
    store.precision = 0;
    store.pi = new Big(3);
    const circumference = store.pi.mul(2).mul(new Big(SUN_RADIUS_KM));
    return res.status(200).json({
      reset: true,
      pi: store.pi.toFixed(store.precision),
      currentIterations: store.precision,
      circumference: circumference.toFixed(2),
    });
  }

  // Handle non-incremental requests
  if (increment === "false") {
    const circumference = store.pi.mul(2).mul(new Big(SUN_RADIUS_KM));
    return res.status(200).json({
      pi: store.pi.toFixed(store.precision),
      currentIterations: store.precision,
      circumference: circumference.toFixed(2),
      incremented: false,
    });
  }

  // Handle increment request
  try {
    store.precision += 1;
    store.pi =
      mode === "optimized"
        ? calculatePiOptimized(store.precision)
        : calculatePiEfficient(store.precision);

    const circumference = store.pi.mul(2).mul(new Big(SUN_RADIUS_KM));

    // Set cache headers
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    return res.status(200).json({
      pi: store.pi.toFixed(store.precision),
      currentIterations: store.precision,
      circumference: circumference.toFixed(2),
      incremented: true,
    });
  } catch (error) {
    console.error("[π API] error computing π:", error);
    return res.status(500).json({ error: "Failed to compute π" });
  }
}
