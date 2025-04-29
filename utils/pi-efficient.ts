import Big from 'big.js';


export function calculatePiEfficient(iterations: number): Big {
  let pi = new Big(0);
  let divisor = new Big(1);

  for (let i = 0; i < iterations; i++) {
    if (i % 2 === 0) {
      pi = pi.plus(new Big(4).div(divisor));
    } else {
      pi = pi.minus(new Big(4).div(divisor));
    }
    divisor = divisor.plus(2);
  }

  return pi;
}

