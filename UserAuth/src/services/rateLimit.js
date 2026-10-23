import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 min
  max: 1,
  message: "Too many password reset attempts. Please try again in 15 minutes.",
  keyGenerator: (req) => req.body.email || ipKeyGenerator(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
});

export const resendActivationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10min
  max: 3,
  message: "Too many resend attempts. Please try again in 10 minutes.",
  keyGenerator: (req) => req.body.email || ipKeyGenerator(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
});
