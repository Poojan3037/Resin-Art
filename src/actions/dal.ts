"use server";

import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { getAuthToken } from "./cookie";

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
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
