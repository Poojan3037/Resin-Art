"use server";

import { cookies } from "next/headers";

const AUTH_COOKIE = "token";
// Must match the JWT `expiresIn` in loginAction.
const MAX_AGE_SECONDS = 60 * 60;

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value || null;
}

export async function clearAuthToken() {
  const cookieStore = await cookies();
  if (cookieStore.has(AUTH_COOKIE)) {
    cookieStore.delete(AUTH_COOKIE);
  }
}

const USER_AUTH_COOKIE = "session";
// Must match USER_JWT_EXPIRES_IN in userLoginAction/signupAction.
const USER_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export async function setUserToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(USER_AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: USER_MAX_AGE_SECONDS,
  });
}

export async function getUserToken() {
  const cookieStore = await cookies();
  return cookieStore.get(USER_AUTH_COOKIE)?.value || null;
}

export async function clearUserToken() {
  const cookieStore = await cookies();
  if (cookieStore.has(USER_AUTH_COOKIE)) {
    cookieStore.delete(USER_AUTH_COOKIE);
  }
}
