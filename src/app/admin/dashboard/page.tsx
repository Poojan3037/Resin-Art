"use client";

import { MOCK_ORDERS, type Order } from "@/constants/admin";
import { PRODUCTS } from "@/constants/shop";
import { WORKSHOPS_DATA } from "@/constants/workshops";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Link from "next/link";

const STATUS_CLASSES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Processing: "bg-teal-50 text-teal border border-teal-200",
  Shipped: "bg-blue-50 text-blue-700 border border-blue-200",
  Delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Cancelled: "bg-blush-light text-pink border border-blush",
};

export default function AdminDashboardPage() {
  const [orders] = useLocalStorage<Order[]>("admin_orders", MOCK_ORDERS);
  const [products] = useLocalStorage("admin_products", PRODUCTS);
  const [workshops] = useLocalStorage("admin_workshops", WORKSHOPS_DATA);

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const upcomingWorkshops = workshops.length;

  const recentOrders = [...orders].slice(0, 5);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: "◈",
      color: "text-teal",
      bg: "bg-teal-pale",
      href: "/admin/products",
    },
    {
      label: "Pending Orders",
      value: pendingCount,
      icon: "✦",
      color: "text-gold-dark",
      bg: "bg-amber-50",
      href: "/admin/orders",
    },
    {
      label: "Upcoming Workshops",
      value: upcomingWorkshops,
      icon: "◆",
      color: "text-navy",
      bg: "bg-blush-light",
      href: "/admin/workshops",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: "▪",
      color: "text-charcoal",
      bg: "bg-light-gray",
      href: "/admin/orders",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page header */}
      <div className="mb-10">
        <span className="text-[11px] tracking-[0.22em] uppercase text-gold">
          Overview
        </span>
        <h1 className="text-[clamp(28px,4vw,44px)] font-semibold text-charcoal mt-1">
          Dashboard
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <div className="bg-white border border-light-gray p-5 sm:p-7 hover:border-gold transition-all duration-300 cursor-pointer h-full">
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-sm ${s.bg} ${s.color} text-[20px] mb-4`}
              >
                {s.icon}
              </div>
              <div
                className={`text-[clamp(28px,3vw,40px)] font-semibold ${s.color} leading-none mb-1`}
              >
                {s.value}
              </div>
              <div className="text-[12px] sm:text-[13px] text-gray tracking-wide uppercase">
                {s.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-12">
        <h2 className="text-[13px] tracking-[0.18em] uppercase text-charcoal font-semibold mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products">
            <button className="bg-charcoal text-gold-light px-5 py-2.5 text-[13px] tracking-[0.12em] uppercase font-semibold hover:bg-gold hover:text-white transition-all duration-300">
              + Add Product
            </button>
          </Link>
          <Link href="/admin/workshops">
            <button className="bg-charcoal text-gold-light px-5 py-2.5 text-[13px] tracking-[0.12em] uppercase font-semibold hover:bg-gold hover:text-white transition-all duration-300">
              + Add Workshop
            </button>
          </Link>
          <Link href="/admin/orders">
            <button className="bg-transparent text-charcoal border border-light-gray px-5 py-2.5 text-[13px] tracking-[0.12em] uppercase font-semibold hover:border-gold hover:text-gold transition-all duration-300">
              View All Orders
            </button>
          </Link>
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[13px] tracking-[0.18em] uppercase text-charcoal font-semibold">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-[12px] tracking-[0.12em] uppercase text-teal hover:text-gold transition-colors duration-200"
          >
            View all →
          </Link>
        </div>

        {/* Table — horizontally scrollable on small screens */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-light-gray text-left min-w-140">
            <thead>
              <tr className="border-b border-light-gray bg-charcoal">
                {["Order", "Customer", "Product", "Amount", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-[11px] tracking-[0.18em] uppercase text-gold-light font-semibold"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr
                  key={order.id}
                  className={`border-b border-light-gray hover:bg-teal-pale/40 transition-colors duration-150 ${i % 2 === 1 ? "bg-cream/50" : ""}`}
                >
                  <td className="px-5 py-4 text-[13px] font-semibold text-charcoal">
                    {order.id}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-charcoal">
                    {order.customer}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray">
                    {order.product}
                  </td>
                  <td className="px-5 py-4 text-[13px] font-semibold text-teal">
                    {order.amount}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[11px] px-2.5 py-1 tracking-widest uppercase font-semibold ${STATUS_CLASSES[order.status] ?? ""}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
