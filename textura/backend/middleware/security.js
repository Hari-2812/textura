const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX || 300);

const buckets = new Map();

const getClientKey = (req) =>
  req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";

export const basicSecurityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; connect-src 'self' https:; script-src 'self' https://checkout.razorpay.com"
  );
  next();
};

export const rateLimiter = (req, res, next) => {
  const now = Date.now();
  const key = getClientKey(req);
  const current = buckets.get(key);

  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (current.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((current.resetAt - now) / 1000);
    res.setHeader("Retry-After", retryAfter);
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please retry later.",
    });
  }

  current.count += 1;
  return next();
};

