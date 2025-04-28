import type { NextApiRequest, NextApiResponse } from "next";
import Decimal from "decimal.js";
import { calculatePiEfficient } from "@/utils/pi-efficient";
import { calculatePiOptimized } from "@/utils/pi-optimized";

type StoreEntry = { pi: Decimal; precision: number };

const piStore: Record<"efficient" | "optimized", StoreEntry> = {
  efficient: { pi: new Decimal(3), precision: 0 },
  optimized: { pi: new Decimal(3), precision: 0 },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: "Method Not Allowed" });
  }

  const { mode: rawMode, reset, debug, increment } = req.query;

  if (debug === "true") {
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
  const mode =
    rawMode === "optimized"
      ? "optimized"
      : rawMode === "efficient"
      ? "efficient"
      : null;

  if (rawMode && mode === null) {
    return res.status(400).json({ error: `Invalid mode: ${rawMode}` });
  }

  const store = piStore[mode as "efficient" | "optimized"];

  if (reset === "true") {
    store.precision = 0;
    store.pi = new Decimal(3);
    const circumference = store.pi.mul(2).mul(new Decimal(695700));

    return res.status(200).json({
      reset: true,
      pi: store.pi.toFixed(store.precision),
      currentIterations: store.precision,
      circumference: circumference.toFixed(2),
    });
  }
  if (increment === "false") {
    const circumference = store.pi.mul(2).mul(new Decimal(695700));

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
      mode === "optimized"
        ? calculatePiOptimized(store.precision)
        : calculatePiEfficient(store.precision);

    const circumference = store.pi.mul(2).mul(new Decimal(695700));
    console.log(`[π API] mode=${mode} precision=${store.precision}`);

    return res.status(200).json({
      pi: store.pi.toFixed(store.precision),
      currentIterations: store.precision,
      circumference: circumference.toFixed(2),
      incremented: true,
    });
  } catch (err: any) {
    console.error("[π API] unexpected error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal Server Error" });
  }
}
