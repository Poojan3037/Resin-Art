import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { verifyUserSession } from "@/actions/dal";
import { getMyOrders } from "@/actions/order";
import Pagination from "@/components/Pagination";
import { MY_ORDERS_PAGE_SIZE } from "@/constants/orders";

export const metadata: Metadata = {
  title: "My Orders",
  robots: {
    index: false,
    follow: false,
  },
};

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const statusBadgeClass = (status: string) =>
  status === "DELIVERED" || status === "CONFIRMED"
    ? "border-teal text-teal"
    : status === "CANCELLED" || status === "FAILED"
      ? "border-red-300 text-red-500"
      : "border-gold text-gold";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

const MyOrdersPage = async ({ searchParams }: Props) => {
  const { isUserVerified } = await verifyUserSession();
  if (!isUserVerified) {
    redirect("/login?redirect=/my-orders");
  }

  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);

  const { orders, totalCount } = await getMyOrders(page);
  const totalPages = Math.max(1, Math.ceil(totalCount / MY_ORDERS_PAGE_SIZE));

  return (
    <div className="max-w-5xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
      <h1 className="text-[clamp(30px,4vw,46px)] font-semibold text-charcoal mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-light-gray p-10 sm:p-12 text-center">
          <h3 className="text-[20px] sm:text-[24px] text-charcoal mb-2.5">
            You haven&apos;t placed any orders yet.
          </h3>
          <Link
            href="/shop"
            className="inline-block mt-6 text-[12px] tracking-[0.14em] uppercase text-gold hover:underline"
          >
            Browse the Shop
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-light-gray">
                  {["Order #", "Date", "Items", "Status", "Total"].map(
                    (col) => (
                      <th
                        key={col}
                        className="pb-3 pr-6 text-[11px] tracking-[0.18em] uppercase text-gray font-semibold"
                      >
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-light-gray/60 hover:bg-cream/40 transition-colors"
                  >
                    <td className="py-4 pr-6 text-[13px] font-medium text-charcoal">
                      {order.orderNumber}
                    </td>
                    <td className="py-4 pr-6 text-[13px] text-gray whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 pr-6 text-[13px] text-gray max-w-70 truncate">
                      {order.items
                        .map((item) => `${item.quantity}× ${item.productTitle}`)
                        .join(", ")}
                    </td>
                    <td className="py-4 pr-6">
                      <span
                        className={`text-[11px] tracking-[0.15em] uppercase px-3 py-1 border ${statusBadgeClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 pr-2 text-[13px] font-semibold text-charcoal">
                      {currencyFormatter.format(Number(order.totalAmount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-light-gray p-5 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[15px] font-semibold text-charcoal">
                    {order.orderNumber}
                  </span>
                  <span
                    className={`text-[11px] tracking-[0.15em] uppercase px-3 py-1 border ${statusBadgeClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-[13px] text-gray">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <p className="text-[13px] text-gray">
                  {order.items
                    .map((item) => `${item.quantity}× ${item.productTitle}`)
                    .join(", ")}
                </p>

                <div className="border-t border-light-gray pt-3 flex justify-between text-[14px] font-semibold">
                  <span>Total</span>
                  <span className="text-gold">
                    {currencyFormatter.format(Number(order.totalAmount))}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/my-orders"
          />
        </>
      )}
    </div>
  );
};

export default MyOrdersPage;
