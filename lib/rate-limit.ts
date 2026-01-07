import { headers } from "next/headers";
import { RateLimitConfig, RateLimitError } from "./rate-limit-shared";

/**
 * Simple in-memory rate limiter with sliding window
 * For production, use Redis or similar distributed cache
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

/**
 * Rate limit based on IP address or session
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<void> {
  const now = Date.now();
  const key = `rate_limit:${identifier}`;

  if (!store[key] || store[key].resetTime < now) {
    // First request or window expired
    store[key] = {
      count: 1,
      resetTime: now + config.interval,
    };
    return;
  }

  store[key].count++;

  if (store[key].count > config.uniqueTokenPerInterval) {
    const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
    throw new RateLimitError(
      `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
      retryAfter
    );
  }
}

export async function getClientIdentifier(): Promise<string> {
  const headersList = await headers();

  const forwarded = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const cfConnectingIp = headersList.get("cf-connecting-ip");

  return (
    cfConnectingIp || realIp || forwarded?.split(",")[0].trim() || "unknown"
  );
}
