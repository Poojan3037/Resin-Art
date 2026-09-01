import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifyUserSession } from "@/actions/dal";
import { getCurrentUser } from "@/actions/user-auth";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage() {
  const { isUserVerified } = await verifyUserSession();
  if (!isUserVerified) {
    redirect("/login?redirect=/checkout");
  }

  const user = await getCurrentUser();

  return <CheckoutClient user={user} />;
}
