import type { Metadata } from "next";
import OrdersClient from "./OrdersClient";

export const metadata: Metadata = {
  title: "Track Your Order",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrdersPage() {
  return <OrdersClient />;
}
