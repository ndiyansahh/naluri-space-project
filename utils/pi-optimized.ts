import Decimal from 'decimal.js';

export function calculatePiOptimized(digits: number): Decimal {
  Decimal.set({ precision: digits + 5 });  // extra guard digits
  const one = new Decimal(1);
  const arctan = (x: number) => {
    let sum = new Decimal(0);
    let term = one.div(x);
    let k = 1;
    while (term.abs().gt(new Decimal(10).pow(-digits))) {
      sum = sum.plus(term.times((k % 2 ? 1 : -1)));
      k += 2;
      term = term.div(x * x).times(new Decimal((k - 2) / k));
    }
    return sum;
  };
  const pi = arctan(5).times(4).minus(arctan(239)).times(4);
  return pi;
}
