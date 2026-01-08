import {
  createError,
  defineEventHandler,
  getRequestHeader,
  setResponseHeader,
} from "h3";

// Simple in-memory rate limiter
// For production, we would do this closer to the edge so it works across multiple server instances

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute per IP
};

function getClientIp(event: any): string {
  // Vercel provides the real IP in x-forwarded-for header
  const forwardedFor = getRequestHeader(event, "x-forwarded-for");
  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0].trim();
  }
  return "unknown";
}

export default defineEventHandler((event) => {
  const ip = getClientIp(event);
  const now = Date.now();

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // New window
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
  } else {
    // Increment count
    record.count++;

    if (record.count > RATE_LIMIT.maxRequests) {
      throw createError({
        statusCode: 429,
        statusMessage: "Too Many Requests",
        message: `Rate limit exceeded. Max ${RATE_LIMIT.maxRequests} requests per minute.`,
      });
    }
  }

  // Add rate limit headers
  const remaining = Math.max(0, RATE_LIMIT.maxRequests - (record?.count || 1));
  setResponseHeader(
    event,
    "X-RateLimit-Limit",
    RATE_LIMIT.maxRequests.toString()
  );
  setResponseHeader(event, "X-RateLimit-Remaining", remaining.toString());
  setResponseHeader(
    event,
    "X-RateLimit-Reset",
    new Date(
      rateLimitMap.get(ip)?.resetTime || now + RATE_LIMIT.windowMs
    ).toISOString()
  );
});
