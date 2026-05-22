"use server";

import { LoginActionState } from "@/types/login";
import { clearAuthToken, setAuthToken } from "./cookie";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifySession } from "./dal";

export async function loginAction(
  _prevState: LoginActionState,
  data: { email: string; password: string },
): Promise<LoginActionState> {
  try {
    const { email, password } = data;
    if (!email || !password) {
      return {
        error: "Email and password are required",
        success: false,
      };
    }

    const user = await prisma.user.findUnique({
      where: { email, isAdmin: true },
    });

    if (!user) {
      return {
        error: "Invalid credentials",
        success: false,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        error: "Invalid credentials",
        success: false,
      };
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    await setAuthToken(token);

    return {
      success: true,
      error: "",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Login failed. Please try again later.",
    };
  }
}

export async function logoutAction() {
  try {
    await clearAuthToken();
    return {
      success: true,
      error: "",
    };
  } catch {
    return {
      success: false,
      error: "Logout failed. Please try again later.",
    };
  }
}

export async function getActiveUser() {
  try {
    const { isUserVerified, userId } = await verifySession({ isAdmin: true });

    if (!isUserVerified) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    return user;
  } catch (error) {
    console.error("Error fetching active user:", error);
    return null;
  }
}
