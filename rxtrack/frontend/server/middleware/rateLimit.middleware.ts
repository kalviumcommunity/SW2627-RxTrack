import rateLimit from "express-rate-limit";

/**
 * Without this, /login is a free password-guessing endpoint — anyone can
 * throw unlimited attempts at it. 10 attempts per 15 minutes per IP is
 * generous enough for a real user who mistypes a password a few times,
 * but makes brute-forcing impractical.
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many login attempts. Please try again in 15 minutes.",
  },
});