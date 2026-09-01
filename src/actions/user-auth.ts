"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { clearUserToken, setUserToken } from "./cookie";
import { verifyUserSession } from "./dal";
import { JWT_ALGORITHM, JWT_SECRET, USER_JWT_EXPIRES_IN } from "@/lib/jwt";
import {
  checkRateLimit,
  getClientIp,
  rateLimitMessage,
} from "@/lib/rate-limit";
import {
  signupSchema,
  userLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/schema/auth";
import { claimGuestRecords } from "@/lib/claim-guest-records";
import { sendPasswordResetEmail } from "./email/auth";

export type UserAuthActionState = {
  success: boolean;
  message: string;
};

const issueSession = async (userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: USER_JWT_EXPIRES_IN,
    algorithm: JWT_ALGORITHM,
  });
  await setUserToken(token);
};

export const signupAction = async (
  _prevState: UserAuthActionState | null,
  data: unknown,
): Promise<UserAuthActionState> => {
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid signup data.",
    };
  }
  const { firstName, lastName, email, password } = parsed.data;

  const ip = await getClientIp();
  for (const identifier of [`ip:${ip}`, `email:${email.toLowerCase()}`]) {
    const limit = await checkRateLimit({ name: "signup", identifier });
    if (!limit.allowed) {
      return { success: false, message: rateLimitMessage(limit.retryAfterSeconds) };
    }
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        isAdmin: false,
      },
      select: { id: true, email: true },
    });

    await claimGuestRecords(user.id, user.email);
    await issueSession(user.id);

    return { success: true, message: "Account created successfully." };
  } catch (error) {
    console.error("[signup] Failed:", error);
    return { success: false, message: "Signup failed. Please try again later." };
  }
};

export const userLoginAction = async (
  _prevState: UserAuthActionState | null,
  data: unknown,
): Promise<UserAuthActionState> => {
  const parsed = userLoginSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid credentials.",
    };
  }
  const { email, password } = parsed.data;

  const ip = await getClientIp();
  for (const identifier of [`ip:${ip}`, `email:${email.toLowerCase()}`]) {
    const limit = await checkRateLimit({ name: "userLogin", identifier });
    if (!limit.allowed) {
      return { success: false, message: rateLimitMessage(limit.retryAfterSeconds) };
    }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email, isAdmin: false },
    });
    if (!user) {
      return { success: false, message: "Invalid credentials." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid credentials." };
    }

    await claimGuestRecords(user.id, user.email);
    await issueSession(user.id);

    return { success: true, message: "Logged in successfully." };
  } catch (error) {
    console.error("[login] Failed:", error);
    return { success: false, message: "Login failed. Please try again later." };
  }
};

export const userLogoutAction = async (): Promise<UserAuthActionState> => {
  try {
    await clearUserToken();
    return { success: true, message: "Logged out." };
  } catch {
    return { success: false, message: "Logout failed. Please try again later." };
  }
};

export const getCurrentUser = async () => {
  try {
    const { isUserVerified, userId } = await verifyUserSession();
    if (!isUserVerified) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

const RESET_TOKEN_TTL_MINUTES = 60;
const GENERIC_RESET_MESSAGE =
  "If an account exists for that email, we've sent a password reset link.";

export const requestPasswordReset = async (
  data: unknown,
): Promise<UserAuthActionState> => {
  const parsed = forgotPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid email.",
    };
  }
  const { email } = parsed.data;

  const ip = await getClientIp();
  for (const identifier of [`ip:${ip}`, `email:${email.toLowerCase()}`]) {
    const limit = await checkRateLimit({ name: "forgotPassword", identifier });
    if (!limit.allowed) {
      return { success: false, message: rateLimitMessage(limit.retryAfterSeconds) };
    }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email, isAdmin: false },
      select: { id: true, firstName: true, email: true },
    });

    // Always the same response — an attacker must not learn whether the
    // email has an account from timing or message differences.
    if (!user) {
      return { success: true, message: GENERIC_RESET_MESSAGE };
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    await prisma.$transaction([
      prisma.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() },
      }),
      prisma.passwordResetToken.create({
        data: { tokenHash, userId: user.id, expiresAt },
      }),
    ]);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const resetUrl = `${siteUrl}/reset-password?token=${rawToken}`;

    if (process.env.NODE_ENV !== "production") {
      console.log(`[forgot-password] Reset link for ${user.email}: ${resetUrl}`);
    }

    // Fire-and-forget: an email failure must not leak whether the account
    // exists via a different response than the generic one below.
    sendPasswordResetEmail({
      toName: user.firstName ?? "there",
      toEmail: user.email,
      resetUrl,
    }).catch((err) => console.error("[email] Password reset email failed:", err));

    return { success: true, message: GENERIC_RESET_MESSAGE };
  } catch (error) {
    console.error("[forgot-password] Failed:", error);
    // Still return the generic message — do not leak failure state either.
    return { success: true, message: GENERIC_RESET_MESSAGE };
  }
};

export const resetPasswordAction = async (
  token: string,
  data: unknown,
): Promise<UserAuthActionState> => {
  if (!token) {
    return { success: false, message: "Reset link is invalid or has expired." };
  }

  const parsed = resetPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid password.",
    };
  }

  const ip = await getClientIp();
  const limit = await checkRateLimit({ name: "resetPassword", identifier: `ip:${ip}` });
  if (!limit.allowed) {
    return { success: false, message: rateLimitMessage(limit.retryAfterSeconds) };
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: { id: true, userId: true, usedAt: true, expiresAt: true },
    });

    if (
      !resetToken ||
      resetToken.usedAt != null ||
      resetToken.expiresAt.getTime() < Date.now()
    ) {
      return { success: false, message: "Reset link is invalid or has expired." };
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);
    const now = new Date();

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword, passwordChangedAt: now },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: now },
      }),
      prisma.passwordResetToken.updateMany({
        where: { userId: resetToken.userId, usedAt: null },
        data: { usedAt: now },
      }),
    ]);

    // The pre-reset session's JWT `iat` predates `passwordChangedAt`, so
    // `verifyUserSession` now rejects it — but clear the cookie too so the
    // current device doesn't hold a dead token around.
    await clearUserToken();

    return { success: true, message: "Password reset successfully." };
  } catch (error) {
    console.error("[reset-password] Failed:", error);
    return { success: false, message: "Reset failed. Please try again later." };
  }
};
