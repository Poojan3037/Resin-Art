"use client";

import { updateOrderStatus } from "@/actions/order";
import Button from "@/components/Button";
import type { OrderWithItemsType } from "@/types/order";
import { OrderStatus } from "../../../../prisma/generated/prisma/client";
import { useTransition } from "react";
import { useQueryState, debounce } from "nuqs";
import { toast } from "sonner";
import OrderStatusBadge from "./OrderStatusBadge";

type AdminOrdersManagerPropsType = {
  orders: OrderWithItemsType[];
};

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const allStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const formatStatus = (status: string) =>
  status
    .split("_")
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(" ");

const AdminOrdersManager = ({ orders }: AdminOrdersManagerPropsType) => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    limitUrlUpdates: debounce(500),
    shallow: false,
  });

  const [statusFilter, setStatusFilter] = useQueryState("status", {
    defaultValue: "ALL",
    shallow: false,
  });

  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-8">
        <span className="text-[11px] tracking-[0.22em] uppercase text-gold">
          Manage
        </span>
        <h1 className="text-[clamp(28px,4vw,44px)] font-semibold text-charcoal mt-1">
          Orders
        </h1>
        <p className="text-[13px] text-gray mt-1">
          {orders.length} orders total
        </p>
      </div>

      <div className="bg-white border border-light-gray p-5">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by order number, customer, email..."
            className="px-4 py-2 border border-light-gray bg-cream text-[14px] min-w-72"
          />

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 text-[12px] border transition-colors ${
                statusFilter === "ALL"
                  ? "bg-charcoal text-white border-charcoal"
                  : "bg-cream text-charcoal border-light-gray hover:border-charcoal"
              }`}
            >
              All
            </button>
            {allStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() =>
                  setStatusFilter(statusFilter === status ? "ALL" : status)
                }
                className={`px-3 py-1.5 text-[12px] border transition-colors ${
                  statusFilter === status
                    ? "bg-charcoal text-white border-charcoal"
                    : "bg-cream text-charcoal border-light-gray hover:border-charcoal"
                }`}
              >
                {formatStatus(status)}
              </button>
            ))}
          </div>
        </div>

        {orders.length === 0 ? (
          <p className="text-gray text-[14px] py-8 text-center">
            No orders found.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-light-gray p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div>
                    <p className="text-[16px] font-semibold text-charcoal">
                      {order.orderNumber}
                    </p>
                    <p className="text-[13px] text-gray">
                      {order.customerName} - {order.customerEmail}
                    </p>
                    <p className="text-[14px] text-gold font-semibold mt-1">
                      {currencyFormatter.format(Number(order.totalAmount))}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <OrderStatusBadge status={order.status} />
                    {order.status !== "DELIVERED" && (
                      <div className="flex flex-wrap gap-1.5">
                        {allStatuses.map((status) => (
                          <button
                            key={status}
                            type="button"
                            disabled={isPending || order.status === status}
                            onClick={() => handleStatusChange(order.id, status)}
                            className={`px-2.5 py-1 text-[12px] border transition-colors ${
                              order.status === status
                                ? "bg-charcoal text-white border-charcoal cursor-default"
                                : "bg-cream text-charcoal border-light-gray hover:border-charcoal"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {formatStatus(status)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-light-gray space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-[13px]"
                    >
                      <span className="text-charcoal">
                        {item.productTitle} ({item.quantity} x{" "}
                        {currencyFormatter.format(Number(item.unitPrice))})
                      </span>
                      <span className="font-semibold text-charcoal">
                        {currencyFormatter.format(Number(item.lineTotal))}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-[12px] text-gray">
                  <p>
                    Ship to: {order.addressLine1}
                    {order.addressLine2 ? `, ${order.addressLine2}` : ""},{" "}
                    {order.city}, {order.state} {order.postalCode},{" "}
                    {order.country}
                  </p>
                  {order.customerNotes ? (
                    <p className="mt-1">Note: {order.customerNotes}</p>
                  ) : null}
                </div>

                {order.payment ? (
                  <div className="mt-4 pt-4 border-t border-light-gray">
                    <p className="text-[11px] tracking-[0.14em] uppercase text-gold mb-2 font-semibold">
                      Payment
                    </p>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[12px]">
                      <div className="flex gap-1">
                        <dt className="text-gray">Order ID:</dt>
                        <dd className="text-charcoal font-mono">{order.id}</dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-gray">Square Payment ID:</dt>
                        <dd className="text-charcoal font-mono">
                          {order.payment.squarePaymentId ?? "—"}
                        </dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-gray">Amount:</dt>
                        <dd className="text-charcoal font-semibold">
                          {currencyFormatter.format(
                            order.payment.amountCents / 100,
                          )}{" "}
                          {order.payment.currency}
                        </dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-gray">Status:</dt>
                        <dd>
                          <span
                            className={`text-[11px] px-2 py-0.5 border font-semibold uppercase tracking-[0.1em] ${
                              order.payment.status === "PAID"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : order.payment.status === "REFUNDED"
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {order.payment.status}
                          </span>
                        </dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-gray">Paid At:</dt>
                        <dd className="text-charcoal">
                          {new Date(order.payment.paidAt).toLocaleString()}
                        </dd>
                      </div>
                      {order.payment.receiptUrl ? (
                        <div className="flex gap-1">
                          <dt className="text-gray">Receipt:</dt>
                          <dd>
                            <a
                              href={order.payment.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gold underline"
                            >
                              View Receipt
                            </a>
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {isPending ? (
          <div className="mt-4">
            <Button variant="ghost" disabled>
              Updating...
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminOrdersManager;
