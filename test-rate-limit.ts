
import { RateLimiter } from './src/lib/rate-limit';

async function testRateLimit() {
    const limiter = new RateLimiter({
        uniqueTokenPerInterval: 500,
        interval: 1000, // 1 second for test
        limit: 5, // 5 requests per second
    });

    const ip = "127.0.0.1";
    console.log("Starting rate limit test...");

    for (let i = 1; i <= 7; i++) {
        try {
            await limiter.check(5, ip);
            console.log(`Request ${i}: Allowed`);
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Request ${i}: Blocked (${error.message})`);
            } else {
                console.log(`Request ${i}: Blocked (Unknown error)`);
            }
        }
    }
}

testRateLimit();
