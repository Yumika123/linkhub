import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { RATE_LIMITS, RateLimitError } from "./lib/rate-limit-shared";

/**
 * Global middleware for security and rate limiting
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js needs unsafe-eval
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
    ].join("; ")
  );

  // Protect cron endpoints
  //   if (request.nextUrl.pathname.startsWith("/api/cron")) {
  //     const authHeader = request.headers.get("authorization");
  //     const vercelCron = request.headers.get("x-vercel-cron");
  //     const cronSecret = process.env.CRON_SECRET;

  //     const isAuthorized =
  //       vercelCron === cronSecret ||
  //       authHeader?.replace("Bearer ", "") === cronSecret;

  //     if (!isAuthorized) {
  //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //     }
  //   }

  // Rate Limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    try {
      await rateLimit(ip, RATE_LIMITS.GENERAL_API);
    } catch (error) {
      if (error instanceof RateLimitError) {
        return NextResponse.json(
          { error: "Too many requests" },
          {
            status: 429,
            headers: { "Retry-After": error.retryAfter.toString() },
          }
        );
      }
    }
  }

  // Detect and block suspicious User-Agents
  const userAgent = request.headers.get("user-agent") || "";
  const suspiciousAgents = [
    "bot",
    "crawler",
    "spider",
    "scraper",
    "curl",
    "wget",
    "python-requests",
  ];

  const isSuspicious = suspiciousAgents.some((agent) =>
    userAgent.toLowerCase().includes(agent)
  );

  // Allow legitimate bots (Google, etc.) but block others from creating content
  if (
    isSuspicious &&
    !userAgent.includes("Googlebot") &&
    !userAgent.includes("Bingbot") &&
    (request.method === "POST" ||
      request.method === "PUT" ||
      request.method === "DELETE")
  ) {
    console.warn(`Blocked suspicious user agent: ${userAgent}`);
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // Limit request body size (10MB)
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
