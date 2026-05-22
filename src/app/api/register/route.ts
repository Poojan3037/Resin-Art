import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { username, email, password } = await request.json();
  if (!username || !email || !password) {
    return NextResponse.json(
      { error: "Username, email and password are required" },
      { status: 400 },
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}
