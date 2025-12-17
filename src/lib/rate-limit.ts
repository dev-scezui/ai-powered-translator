export interface RateLimitConfig {
    uniqueTokenPerInterval: number; // Max number of unique IPs to track to prevent memory leaks
    interval: number; // Interval in milliseconds
    limit: number; // Max requests per interval
}

export class RateLimiter {
    private tokenCache: Map<string, number[]>;
    private config: RateLimitConfig;

    constructor(config: RateLimitConfig) {
        this.config = config;
        this.tokenCache = new Map();
    }

    check(limit: number, token: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const now = Date.now();
            const windowStart = now - this.config.interval;

            const timestamps = this.tokenCache.get(token) || [];

            // Filter out timestamps outside the window
            const validTimestamps = timestamps.filter((timestamp) => timestamp > windowStart);

            // Check if limit is exceeded
            if (validTimestamps.length >= limit) {
                reject(new Error("Rate limit exceeded"));
                return;
            }

            // Add current timestamp
            validTimestamps.push(now);
            this.tokenCache.set(token, validTimestamps);

            // Cleanup if cache grows too large (simple LRU-ish safeguard)
            if (this.tokenCache.size > this.config.uniqueTokenPerInterval) {
                // Remove the oldest entry (first key) - crude but effective for simple prevention
                const firstKey = this.tokenCache.keys().next().value;
                if (firstKey) {
                    this.tokenCache.delete(firstKey);
                }
            }

            resolve();
        });
    }
}

// Singleton instance for the app
// Limit: 10 requests per 60 seconds per IP
export const rateLimiter = new RateLimiter({
    uniqueTokenPerInterval: 500,
    interval: 60000,
    limit: 10,
});
