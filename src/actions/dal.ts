"use server";

import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { getAuthToken } from "./cookie";
import { JWT_SECRET, JWT_VERIFY_OPTIONS } from "@/lib/jwt";

type InputParamsType = {
  isAdmin: boolean;
};

type SuccessFunctionReturnType = {
  isUserVerified: true;
  userId: string;
};

type FailureFunctionReturnType = {
  isUserVerified: false;
  userId: null;
};

export const verifySession = async (
  params: InputParamsType,
): Promise<SuccessFunctionReturnType | FailureFunctionReturnType> => {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        isUserVerified: false,
        userId: null,
      };
    }

    const decoded = jwt.verify(token, JWT_SECRET, JWT_VERIFY_OPTIONS) as unknown as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId, isAdmin: params.isAdmin },
      select: { id: true },
    });

    if (user == null) {
      return {
        isUserVerified: false,
        userId: null,
      };
    } else {
      return {
        isUserVerified: true,
        userId: user.id,
      };
    }
  } catch {
    return {
      isUserVerified: false,
      userId: null,
    };
  }
};
