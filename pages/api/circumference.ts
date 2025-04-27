import type { NextApiRequest, NextApiResponse } from 'next';
import Decimal from 'decimal.js';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sunRadius = new Decimal(695700);

  const basePi = new Decimal(Math.PI);
  const randomNoise = new Decimal(Math.random()).div(1000000); 
  const dynamicPi = basePi.plus(randomNoise);

  const circumference = dynamicPi.mul(2).mul(sunRadius);

  res.status(200).json({
    pi: dynamicPi.toFixed(20),
    circumference: circumference.toFixed(2) + ' km', 
  });
}
