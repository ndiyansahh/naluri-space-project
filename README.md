# Naluri Space Project: Solar System Modeling

## Project Overview

This project addresses the Naluri space project challenge of modeling the solar system, starting with calculating the circumference of the sun. The implementation provides:

1. An HTTP server that calculates Pi with increasing precision (3, 3.1, 3.14, etc.)
2. Storage of the most accurate calculated value
3. A web application displaying the current Pi value and sun's circumference

## Technical Highlights

### 1. Algorithmic Pi Calculation

As required, Pi is calculated algorithmically using known mathematical formulas. The implementation includes two different methods based on classic mathematical approaches:

#### Leibniz Series (Efficient Implementation)

[Leibniz formula for π](https://en.wikipedia.org/wiki/Leibniz_formula_for_%CF%80) - First published by Gottfried Wilhelm Leibniz in 1676

```typescript
// Implementation of the Leibniz formula for π
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
```

The Leibniz formula represents π as an infinite series:

```
π/4 = 1 - 1/3 + 1/5 - 1/7 + 1/9 - ...
```

#### Machin's Formula (Optimized Implementation)

[Machin's formula](https://en.wikipedia.org/wiki/Machin-like_formula) - Developed by John Machin in 1706

```typescript
export function calculatePiOptimized(digits: number): Big {
  // Set precision and rounding mode
  Big.DP = digits + 2;
  Big.RM = Big.roundHalfUp;

  // Calculate π using Machin's formula: π/4 = 4*arctan(1/5) - arctan(1/239)
  const part1 = arctan(5).times(4);
  const part2 = arctan(239);
  return part1.minus(part2).times(4);
}
```

Machin's formula uses arctangent relationships to compute π:

```
π/4 = 4*arctan(1/5) - arctan(1/239)
```

### 2. State Persistence Solution

To ensure the server stores the most accurate value between requests, we implemented a Redis-based persistence layer:

```typescript
const getRedisClient = () => {
  return process.env.VERCEL ? kv : upstashRedis;
};

try {
  kvStore = await redis.get(storeKey) as KVStoreEntry;
  if (kvStore) {
    store = {
      precision: kvStore.precision,
      pi: new Big(kvStore.pi)
    };
  }
} catch (err) {
  console.log('Redis error, using memory store:', err);
}
```

### 3. Web Application Implementation

- **HTTP Server**: Next.js API routes provide the calculation endpoint
- **Web Interface**: React components display current Pi value and sun's circumference
- **Persistence**: Redis ensures the most accurate value is stored between requests
- **Authentication**: Bearer token implementation for API security

## Pragmatic MVP Approach

This implementation focuses on delivering a working solution with:

1. **Minimal Dependencies**: Only essential packages to solve the core problem
2. **Resilient Design**: Graceful handling of failures and edge cases
3. **Deployment Ready**: Configured for immediate Vercel deployment

### Libraries & Technologies

| Library | Purpose | Justification |
|---------|---------|---------------|
| **Next.js** | Framework | Server-side rendering and API routes in a single framework |
| **big.js** | Pi calculation | Precision decimal arithmetic essential for accurate Pi calculation |
| **@vercel/kv** | Production storage | Seamless integration with Vercel deployment platform |
| **@upstash/redis** | Development storage | Direct Redis access for local development |
| **SWR** | Data fetching | Stale-while-revalidate pattern for optimal UX |

## Implementation Notes

### Approach

As specified in the challenge requirements:
1. Pi is calculated algorithmically using known mathematical formulas
2. The project is initialized as a Git repository with proper structure
3. Third-party libraries are used for the web application, but Pi calculation is implemented algorithmically

### Limitations & Future Considerations

#### Current Implementation Drawbacks

1. **Redis Implementation**
   - Basic implementation without connection pooling
   - No retry mechanisms for failed Redis operations
   - Single Redis instance creates a potential single point of failure

2. **Pi Calculation Efficiency**
   - Algorithms prioritize correctness over computational efficiency
   - Calculations become increasingly expensive at higher precision levels
   - No caching of intermediate calculation steps

3. **Error Handling and Monitoring**
   - Basic console logging without structured error handling
   - No centralized error monitoring or alerting
   - Limited visibility into production issues

4. **Testing Coverage**
   - Primarily manual testing
   - No unit tests for core calculation functions
   - No integration tests for API endpoints

5. **Authentication and Security**
   - Simple Bearer token authentication
   - No rate limiting to prevent abuse
   - No input validation for API parameters

### Why These Trade-offs Were Made

As an MVP, this implementation prioritizes proving the core concept with a reliable solution. The architecture is designed to be extensible, allowing these limitations to be addressed in future iterations without significant refactoring.

### Evolution Paths

The current architecture supports several evolution paths depending on future requirements:

- **Performance Optimization**: The calculation algorithms could be enhanced with more efficient mathematical approaches like the Chudnovsky algorithm, which converges approximately 14 digits per term
- **Scalability**: Redis implementation could evolve to include connection pooling, clustering, and replication
- **Reliability**: Adding comprehensive error handling, retry mechanisms, and monitoring integration
- **Security**: Enhancing authentication with JWT, implementing rate limiting, and adding input validation
- **Quality Assurance**: Building out automated testing including unit, integration, and end-to-end tests

## Algorithm Research & References

### Convergence Properties

| Algorithm | Convergence Rate | Efficiency | Implementation Complexity |
|-----------|-----------------|-----------|---------------------------|
| Leibniz Series | O(1/n) | Low | Simple |
| Machin's Formula | O(1/n²) | Medium | Moderate |
| Chudnovsky (Future) | O(1/n³) | Very High | Complex |

### Research References

1. Borwein, J. M., & Borwein, P. B. (1987). *Pi and the AGM: A Study in Analytic Number Theory and Computational Complexity*. Wiley. [Google Books](https://books.google.com/books?id=JW-IMQnWQzYC)
2. Bailey, D. H., Borwein, P. B., & Plouffe, S. (1997). "On the Rapid Computation of Various Polylogarithmic Constants." *Mathematics of Computation*, 66(218), 903-913. [DOI: 10.1090/S0025-5718-97-00856-9](https://doi.org/10.1090/S0025-5718-97-00856-9)
3. Arndt, J., & Haenel, C. (2001). *Pi Unleashed*. Springer. [DOI: 10.1007/978-3-642-56735-3](https://doi.org/10.1007/978-3-642-56735-3)
4. Chudnovsky, D. V., & Chudnovsky, G. V. (1989). "Approximations and Complex Multiplication According to Ramanujan." In *Ramanujan Revisited* (pp. 375-472). [Academic Press](https://www.sciencedirect.com/book/9780121599805/ramanujan-revisited)

## Getting Started

```bash
# Install dependencies
npm install

# Configure environment variables (.env.local)
API_SECRET_KEY=your-server-key
PUBLIC_API_SECRET_KEY=your-client-key
KV_REST_API_URL=your-redis-url
KV_REST_API_TOKEN=your-redis-token

# Run development server
npm run dev
```

## Deployment

### Live Demo

**[View Live Demo: https://naluri-space-project.vercel.app/](https://naluri-space-project.vercel.app/)**

The live demo showcases the Pi calculation with persistent state management using Redis.

### Deployment Instructions

The project is configured for Vercel deployment with minimal setup. Just add the environment variables in your Vercel project settings.

---

*This MVP demonstrates a practical approach to solving real-world challenges in serverless architectures while maintaining a focus on reliability and correctness.*
