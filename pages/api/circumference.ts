import type { NextApiRequest, NextApiResponse } from 'next';
import Big from 'big.js';
import { Redis } from '@upstash/redis'; // Use Upstash Redis directly
import { calculatePiEfficient } from '@/utils/pi-efficient';
import { calculatePiOptimized } from '@/utils/pi-optimized';
import { SUN_RADIUS_KM, API_SECRET_KEY, PUBLIC_API_KEY, shouldEnforceAuth } from '@/utils/constants';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});



type MemoryStoreEntry = { pi: Big; precision: number };

type KVStoreEntry = { pi: string; precision: number };
// Initial values used to initialize the memory store
const initialValues = {
  pi: new Big(3),
  precision: 0
};
const memoryStore: Record<'efficient' | 'optimized', MemoryStoreEntry> = {
  efficient: { pi: new Big(initialValues.pi), precision: initialValues.precision },
  optimized: { pi: new Big(initialValues.pi), precision: initialValues.precision },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { mode: rawMode, reset, debug, increment } = req.query;
  
  // Debug endpoint
  if (debug === 'true' && process.env.NODE_ENV !== 'production') {
    try {
      const efficientStore = await redis.get('piStore:efficient') as KVStoreEntry;
      const optimizedStore = await redis.get('piStore:optimized') as KVStoreEntry;
      
      return res.status(200).json({
        store: {
          efficient: {
            precision: efficientStore ? efficientStore.precision : memoryStore.efficient.precision,
            pi: efficientStore ? efficientStore.pi : memoryStore.efficient.pi.toString(),
          },
          optimized: {
            precision: optimizedStore ? optimizedStore.precision : memoryStore.optimized.precision,
            pi: optimizedStore ? optimizedStore.pi : memoryStore.optimized.pi.toString(),
          },
        },
      });
    } catch (_err) {
      return res.status(200).json({
        store: {
          efficient: {
            precision: memoryStore.efficient.precision,
            pi: memoryStore.efficient.pi.toString(),
          },
          optimized: {
            precision: memoryStore.optimized.precision,
            pi: memoryStore.optimized.pi.toString(),
          },
        },
      });
    }
  }

  const isDirectApiAccess = !req.headers.referer || !req.headers.referer.includes(req.headers.host as string);
  
  /*
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
    const authHeader = req.headers['authorization'];
    const expectedAuthPrivate = `Bearer ${API_SECRET_KEY}`;
    const expectedAuthPublic = `Bearer ${PUBLIC_API_KEY}`;
  
    console.log('Auth check:', {
      expectedPrivateLength: expectedAuthPrivate.length,
      expectedPublicLength: expectedAuthPublic.length,
      headerLength: authHeader ? authHeader.length : 0,
      matchesPrivate: authHeader === expectedAuthPrivate,
      matchesPublic: authHeader === expectedAuthPublic
    });
    
    if (!authHeader || (authHeader !== expectedAuthPrivate && authHeader !== expectedAuthPublic)) {
      console.log(`Auth failed: Header ${authHeader ? 'present' : 'missing'}, server key ${API_SECRET_KEY ? 'configured' : 'not configured'}, public key ${PUBLIC_API_KEY ? 'configured' : 'not configured'}`);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    console.log('Auth bypassed:', {
      isDirect: isDirectApiAccess,
      environment: process.env.NODE_ENV,
      keyConfigured: !!API_SECRET_KEY
    });
  }

  const mode = rawMode === 'optimized' ? 'optimized' : 'efficient';
  if (rawMode && mode !== rawMode) {
    return res.status(400).json({ error: `Invalid mode: ${rawMode}` });
  }

  const storeKey = `piStore:${mode}`;
  let kvStore: KVStoreEntry | null = null;
  let store = memoryStore[mode]; 
  
  try {
    kvStore = await redis.get(storeKey) as KVStoreEntry;
    
    if (kvStore) {
      store = {
        precision: kvStore.precision,
        pi: new Big(kvStore.pi)
      };
    } else {
      await redis.set(storeKey, {
        pi: store.pi.toString(),
        precision: store.precision
      });
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    console.log('KV error, using memory store:', err);
  }

  if (reset === 'true') {
    store.precision = 0;
    store.pi = new Big(3);
    
    try {
      await redis.set(storeKey, {
        pi: "3",
        precision: 0
      });
    } catch (err) {
      console.log('KV reset error:', err);
    }
    
    const circumference = store.pi.mul(2).mul(new Big(SUN_RADIUS_KM));
    return res.status(200).json({
      reset: true,
      pi: store.pi.toFixed(store.precision),
      currentIterations: store.precision,
      circumference: circumference.toFixed(2),
    });
  }

  // Handle non-incremental requests
  if (increment === 'false') {
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
      mode === 'optimized'
        ? calculatePiOptimized(store.precision)
        : calculatePiEfficient(store.precision);
    memoryStore[mode] = store;

    try {
      await redis.set(storeKey, {
        pi: store.pi.toString(),
        precision: store.precision
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (kvErr) {
      console.log('Redis update error:', kvErr);
    }

    const circumference = store.pi.mul(2).mul(new Big(SUN_RADIUS_KM));

    // Set cache headers
    res.setHeader(
      'Cache-Control',
      's-maxage=60, stale-while-revalidate=300'
    );
    
    return res.status(200).json({
      pi: store.pi.toFixed(store.precision),
      currentIterations: store.precision,
      circumference: circumference.toFixed(2),
      incremented: true,
    });
  } catch (err: unknown) {
    console.error('[π API] error computing π:', err);
    return res.status(500).json({ error: 'Failed to compute π' });
  }
}