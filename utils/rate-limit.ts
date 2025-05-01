// Simple in-memory store for rate limiting
const tokenBucket = new Map<string, { tokens: number; lastRefill: number }>()

// Rate limit configuration
const BUCKET_CAPACITY = 5 // Max number of requests in a time window
const REFILL_RATE = 60 * 1000 // Refill rate in milliseconds (1 minute)

/**
 * Simple token bucket rate limiter
 * @param identifier The identifier to rate limit (usually IP address)
 * @returns {boolean} Whether the request should be allowed
 */
export function isRateLimited(identifier: string): boolean {
  const now = Date.now()
  
  // Get or initialize bucket for this identifier
  let bucket = tokenBucket.get(identifier)
  if (!bucket) {
    bucket = { tokens: BUCKET_CAPACITY, lastRefill: now }
    tokenBucket.set(identifier, bucket)
    return false // First request is always allowed
  }
  
  // Refill tokens based on time elapsed
  const timeElapsed = now - bucket.lastRefill
  const tokensToAdd = Math.floor(timeElapsed / REFILL_RATE)
  
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(BUCKET_CAPACITY, bucket.tokens + tokensToAdd)
    bucket.lastRefill = now
  }
  
  // Check if bucket has tokens
  if (bucket.tokens > 0) {
    bucket.tokens -= 1
    return false // Not rate limited
  } else {
    return true // Rate limited
  }
}

// Clean up expired buckets every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    // Use Array.from to handle Map entries in a compatible way
    Array.from(tokenBucket.entries()).forEach(([key, bucket]) => {
      if (now - bucket.lastRefill > REFILL_RATE * 10) {
        tokenBucket.delete(key)
      }
    })
  }, 60 * 60 * 1000)
} 