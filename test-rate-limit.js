
class RateLimiter {
    constructor(config) {
        this.config = config;
        this.tokenCache = new Map();
    }

    check(limit, token) {
        return new Promise((resolve, reject) => {
            const now = Date.now();
            const windowStart = now - this.config.interval;

            const timestamps = this.tokenCache.get(token) || [];

            const validTimestamps = timestamps.filter((timestamp) => timestamp > windowStart);

            if (validTimestamps.length >= limit) {
                reject(new Error("Rate limit exceeded"));
                return;
            }

            validTimestamps.push(now);
            this.tokenCache.set(token, validTimestamps);

            if (this.tokenCache.size > this.config.uniqueTokenPerInterval) {
                const firstKey = this.tokenCache.keys().next().value;
                if (firstKey) {
                    this.tokenCache.delete(firstKey);
                }
            }

            resolve();
        });
    }
}

async function testRateLimit() {
    const limiter = new RateLimiter({
        uniqueTokenPerInterval: 500,
        interval: 1000,
        limit: 5,
    });

    const ip = "127.0.0.1";
    console.log("Starting rate limit test...");

    for (let i = 1; i <= 7; i++) {
        try {
            await limiter.check(5, ip);
            console.log(`Request ${i}: Allowed`);
        } catch (error) {
            console.log(`Request ${i}: Blocked (${error.message})`);
        }
    }
}

testRateLimit();
