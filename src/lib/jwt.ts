import "server-only";
import type jwt from "jsonwebtoken";

/**
 * Single source of truth for the JWT secret and verification options.
 * Fails loudly at import time rather than via a `!` assertion at request time.
 */
const secret = process.env.JWT_SECRET;

if (!secret || secret.length < 32) {
  throw new Error(
    "JWT_SECRET environment variable is missing or shorter than 32 characters",
  );
}

export const JWT_SECRET: string = secret;

// Pin the algorithm so a token cannot dictate how it is verified.
export const JWT_ALGORITHM = "HS256" as const;
export const JWT_VERIFY_OPTIONS: jwt.VerifyOptions = {
  algorithms: [JWT_ALGORITHM],
};
export const JWT_EXPIRES_IN = "1h" as const;
export const USER_JWT_EXPIRES_IN = "30d" as const;
