import Decimal from 'decimal.js';

export function calculatePiEfficient(iterations: number): Decimal {
  let pi = new Decimal(0);
  let divisor = new Decimal(1);

  for (let i = 0; i < iterations; i++) {
    if (i % 2 === 0) {
      pi = pi.plus(new Decimal(4).div(divisor));
    } else {
      pi = pi.minus(new Decimal(4).div(divisor));
    }
    divisor = divisor.plus(2);
  }

  return pi;
}

