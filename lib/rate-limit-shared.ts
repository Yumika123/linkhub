export interface RateLimitConfig {
  uniqueTokenPerInterval: number; // max requests
  interval: number; // time window in ms
}

export class RateLimitError extends Error {
  constructor(message: string, public retryAfter: number) {
    super(message);
    this.name = "RateLimitError";
  }
}

/**
 * Different rate limit configs for different actions
 */
export const RATE_LIMITS = {
  // Anonymous page creation: 20 pages per hour
  ANON_CREATE_PAGE: {
    uniqueTokenPerInterval: 20,
    interval: 60 * 60 * 1000,
  },

  // Anonymous link creation: 50 links per hour
  //   ANON_CREATE_LINK: {
  //     uniqueTokenPerInterval: 50,
  //     interval: 60 * 60 * 1000,
  //   },

  // Authenticated users: 20 pages per hour
  AUTH_CREATE_PAGE: {
    uniqueTokenPerInterval: 20,
    interval: 60 * 60 * 1000,
  },

  // Authenticated users: 80 links per hour
  AUTH_CREATE_LINK: {
    uniqueTokenPerInterval: 80,
    interval: 60 * 60 * 1000,
  },

  // General API calls: prevent API abuse
  GENERAL_API: {
    uniqueTokenPerInterval: 100,
    interval: 60 * 1000, // 1 minute
  },
} as const;
