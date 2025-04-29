import Big from "big.js";

export function calculatePiOptimized(digits: number): Big {
  Big.DP = digits + 2;
  Big.RM = Big.roundHalfUp;

  const one = new Big(1);
  const pow10 = (n: number) => new Big(10).pow(n);

  function arctan(x: number): Big {
    let term = one.div(x);
    let sum = term;
    let k = 1;
    const threshold = pow10(-(digits + 1));
    const x2 = new Big(x).times(x);

    while (term.abs().gt(threshold)) {
      term = term.times(new Big(-(2 * k - 1)).div(2 * k + 1)).div(x2);
      sum = sum.plus(term);
      k++;
      if (k > 10000) break;
    }

    return sum;
  }

  const part1 = arctan(5).times(4);
  const part2 = arctan(239);
  return part1.minus(part2).times(4);
}
