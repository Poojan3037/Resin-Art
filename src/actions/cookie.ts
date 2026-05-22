"use server";

import { cookies } from "next/headers";

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    sameSite: "strict",
  });
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || null;
}

export async function clearAuthToken() {
  const cookieStore = await cookies();
  if (cookieStore.has("token")) {
    cookieStore.delete("token");
  }
}
