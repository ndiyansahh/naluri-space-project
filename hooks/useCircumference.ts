import type { NextApiRequest, NextApiResponse } from 'next';
import Big from 'big.js';
import { calculatePiEfficient } from '@/utils/pi-efficient';
import { calculatePiOptimized } from '@/utils/pi-optimized';
import { SUN_RADIUS_KM } from '@/utils/constants';

type StoreEntry = { pi: Big; precision: number };

const piStore: Record<'efficient' | 'optimized', StoreEntry> = {
  efficient:  { pi: new Big(3), precision: 0 },
  optimized: { pi: new Big(3), precision: 0 },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { mode: rawMode, reset, debug, increment } = req.query;

  if (debug === 'true' && process.env.NODE_ENV !== 'production') {
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

  const mode = rawMode === 'optimized' ? 'optimized' : 'efficient';
  if (rawMode && mode !== rawMode) {
    return res.status(400).json({ error: `Invalid mode: ${rawMode}` });
  }

  const store = piStore[mode];

  // Handle reset request
  if (reset === 'true') {
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