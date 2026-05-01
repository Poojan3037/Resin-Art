"use client";

import React from "react";
import { MOCK_ORDERS, type Order, type OrderStatus } from "@/constants/admin";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useState } from "react";

const ALL_STATUSES: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const STATUS_CLASSES: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Processing: "bg-teal-50 text-teal border border-teal-200",
  Shipped: "bg-blue-50 text-blue-700 border border-blue-200",
  Delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Cancelled: "bg-blush-light text-pink border border-blush",
};

export default function AdminOrdersPage() {
  const [orders, setOrders, hydrated] = useLocalStorage<Order[]>(
    "admin_orders",
    MOCK_ORDERS,
  );
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      q === "" ||
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.product.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const countFor = (s: OrderStatus | "All") =>
    s === "All" ? orders.length : orders.filter((o) => o.status === s).length;

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <span className="text-[14px] tracking-[0.2em] uppercase text-gray">
          Loading…
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10">
        <span className="text-[11px] tracking-[0.22em] uppercase text-gold">
          Track
        </span>
        <h1 className="text-[clamp(28px,4vw,44px)] font-semibold text-charcoal mt-1">
          Orders
        </h1>
        <p className="text-[13px] text-gray mt-1">
          {orders.length} order{orders.length === 1 ? "" : "s"} total
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-sm">
        <input
          type="text"
          placeholder="Search by order, customer, product…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-white"
        />
      </div>

      {/* Status filter tabs — scrollable on small screens */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {(["All", ...ALL_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`shrink-0 px-4 py-2 text-[11px] tracking-[0.14em] uppercase font-semibold border transition-all duration-200 ${
              filterStatus === s
                ? "bg-charcoal text-gold-light border-charcoal"
                : "bg-white text-gray border-light-gray hover:border-charcoal hover:text-charcoal"
            }`}
          >
            {s} <span className="ml-1 opacity-70">({countFor(s)})</span>
          </button>
        ))}
      </div>

      {/* Orders table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray text-[14px] tracking-wide">
          No orders match the current filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-light-gray text-left min-w-175">
            <thead>
              <tr className="border-b border-light-gray bg-charcoal">
                {[
                  "Order",
                  "Customer",
                  "Product",
                  "Date",
                  "Amount",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-[11px] tracking-[0.18em] uppercase text-gold-light font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <React.Fragment key={order.id}>
                  <tr
                    className={`border-b border-light-gray hover:bg-teal-pale/40 transition-colors duration-150 ${i % 2 === 1 ? "bg-cream/50" : ""}`}
                  >
                    {/* Order ID — click to expand detail */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          setExpandedId((id) =>
                            id === order.id ? null : order.id,
                          )
                        }
                        className="text-[13px] font-semibold text-teal hover:text-gold transition-colors duration-200"
                      >
                        {order.id}
                        <span className="ml-1 text-[10px]">
                          {expandedId === order.id ? "▲" : "▼"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-charcoal">
                      {order.customer}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray max-w-40 truncate">
                      {order.product}
                    </td>
                    <td className="px-5 py-4 text-[12px] text-gray whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-teal whitespace-nowrap">
                      {order.amount}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[11px] px-2.5 py-1 tracking-widest uppercase font-semibold ${STATUS_CLASSES[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    {/* Inline status change */}
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="text-[12px] border border-light-gray px-2 py-1.5 outline-none focus:border-gold transition-colors duration-200 bg-cream cursor-pointer"
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>

                  {expandedId === order.id && (
                    <tr
                      key={`${order.id}-detail`}
                      className="border-b border-light-gray bg-teal-pale/30"
                    >
                      <td colSpan={7} className="px-5 py-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-[13px]">
                          <div>
                            <span className="text-[11px] tracking-[0.15em] uppercase text-gray block mb-1">
                              Customer Email
                            </span>
                            <span className="text-charcoal font-medium">
                              {order.email}
                            </span>
                          </div>
                          <div>
                            <span className="text-[11px] tracking-[0.15em] uppercase text-gray block mb-1">
                              Product
                            </span>
                            <span className="text-charcoal font-medium">
                              {order.product}
                            </span>
                          </div>
                          <div>
                            <span className="text-[11px] tracking-[0.15em] uppercase text-gray block mb-1">
                              Order Date
                            </span>
                            <span className="text-charcoal font-medium">
                              {order.date}
                            </span>
                          </div>
                          <div>
                            <span className="text-[11px] tracking-[0.15em] uppercase text-gray block mb-1">
                              Amount
                            </span>
                            <span className="text-gold font-extrabold text-[16px]">
                              {order.amount}
                            </span>
                          </div>
                          <div>
                            <span className="text-[11px] tracking-[0.15em] uppercase text-gray block mb-1">
                              Current Status
                            </span>
                            <span
                              className={`text-[11px] px-2.5 py-1 tracking-widest uppercase font-semibold inline-block ${STATUS_CLASSES[order.status]}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
