// utils/pi-optimized.ts
import Big from 'big.js';

// Machin formula: π = 4*arctan(1/5) − arctan(1/239)
export function calculatePiOptimized(digits: number): Big {
  // Atur precision (decimal places) dan rounding mode
  Big.DP = digits + 2;                // jumlah decimal places
  Big.RM = Big.roundHalfUp;           // rounding mode

  const one = new Big(1);
  const pow10 = (n: number) => new Big(10).pow(n);

  function arctan(x: number): Big {
    // arctan(1/x) series: Σ (-1)^k / ((2k+1) * x^(2k+1))
    let term = one.div(x);
    let sum  = term;
    let k    = 1;
    const threshold = pow10(-(digits + 1));
    const x2 = new Big(x).times(x);

    while (term.abs().gt(threshold)) {
      // term *= -1 * (2k-1)/(2k+1) / x^2
      term = term
        .times(new Big(-(2 * k - 1)).div(2 * k + 1))
        .div(x2);
      sum = sum.plus(term);
      k++;
      if (k > 10000) break;  // safety cap
    }

    return sum;
  }

  // Hitung π dengan Machin identity
  const part1 = arctan(5).times(4);
  const part2 = arctan(239);
  return part1.minus(part2).times(4);
}
