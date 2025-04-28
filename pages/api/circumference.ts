import type { NextApiRequest, NextApiResponse } from 'next';
import Decimal from 'decimal.js';
import { calculatePiEfficient } from '@/utils/pi-efficient';
import { calculatePiOptimized } from '@/utils/pi-optimized';
import { SUN_RADIUS_KM, API_SECRET_KEY } from '@/utils/constants';

type StoreEntry = { pi: Decimal; precision: number };

const piStore: Record<'efficient' | 'optimized', StoreEntry> = {
  efficient:  { pi: new Decimal(3), precision: 0 },
  optimized: { pi: new Decimal(3), precision: 0 },
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

  // 2) Autentikasi hanya di production
  if (process.env.NODE_ENV === 'production') {
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== `Bearer ${API_SECRET_KEY}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const mode = rawMode === 'optimized' ? 'optimized' : 'efficient';
  if (rawMode && mode !== rawMode) {
    return res.status(400).json({ error: `Invalid mode: ${rawMode}` });
  }

  const store = piStore[mode];

  if (reset === 'true') {
    store.precision = 0;
    store.pi = new Decimal(3);
    const circumference = store.pi.mul(2).mul(new Decimal(SUN_RADIUS_KM));
    return res.status(200).json({
      reset: true,
      pi: store.pi.toFixed(store.precision),
      currentIterations: store.precision,
      circumference: circumference.toFixed(2),
    });
  }

  if (increment === 'false') {
    const circumference = store.pi.mul(2).mul(new Decimal(SUN_RADIUS_KM));
    return res.status(200).json({
      pi: store.pi.toFixed(store.precision),
      currentIterations: store.precision,
      circumference: circumference.toFixed(2),
      incremented: false,
    });
  }
  
  try {
    store.precision += 1;
    store.pi =
      mode === 'optimized'
        ? calculatePiOptimized(store.precision)
        : calculatePiEfficient(store.precision);

    const circumference = store.pi.mul(2).mul(new Decimal(SUN_RADIUS_KM));
    return res.status(200).json({
      pi: store.pi.toFixed(store.precision),
      currentIterations: store.precision,
      circumference: circumference.toFixed(2),
      incremented: true,
    });
  } catch (err: any) {
    console.error('[π API] error computing π:', err);
    return res.status(500).json({ error: 'Failed to compute π' });
  }
}
