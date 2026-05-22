import { getAdminOrders } from "@/actions/order";
import StatCardList from "@/components/admin/dashboard/StatCardList";
import StatCardListSkeleton from "@/components/admin/dashboard/StatCardListSkeleton";
import PlusIcon from "@/components/icons/PlusIcon";
import Link from "next/link";
import { Suspense } from "react";

const STATUS_CLASSES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Processing: "bg-teal-50 text-teal border border-teal-200",
  Shipped: "bg-blue-50 text-blue-700 border border-blue-200",
  Delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Cancelled: "bg-blush-light text-pink border border-blush",
};

const AdminDashboardPage = async () => {
  const orders = await getAdminOrders({ search: "", status: undefined });

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
      <Suspense fallback={<StatCardListSkeleton />}>
        <StatCardList />
      </Suspense>

      {/* Quick actions */}
      <div className="mb-12">
        <h2 className="text-[13px] tracking-[0.18em] uppercase text-charcoal font-semibold mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products">
            <button className="bg-charcoal text-gold-light px-6 py-3.5 text-[14px] tracking-[0.12em] uppercase font-semibold hover:bg-gold hover:text-white transition-all duration-300 flex gap-2 items-center">
              <PlusIcon /> Add Product
            </button>
          </Link>
          <Link href="/admin/workshops">
            <button className="bg-charcoal text-gold-light px-6 py-3.5 text-[14px] tracking-[0.12em] uppercase font-semibold hover:bg-gold hover:text-white transition-all duration-300 flex gap-2 items-center">
              <PlusIcon /> Add Workshop
            </button>
          </Link>
          <Link href="/admin/orders">
            <button className="bg-transparent text-charcoal border border-light-gray px-6 py-3.5 text-[14px] tracking-[0.12em] uppercase font-semibold hover:border-gold hover:text-gold transition-all duration-300">
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
        {orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-light-gray text-left min-w-140">
              <thead>
                <tr className="border-b border-light-gray bg-charcoal">
                  {["Order No.", "Customer", "Amount", "Status"].map((h) => (
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
                7
                {orders.slice(0, 5).map((order, i) => (
                  <tr
                    key={order.id}
                    className={`border-b border-light-gray hover:bg-teal-pale/40 transition-colors duration-150 ${i % 2 === 1 ? "bg-cream/50" : ""}`}
                  >
                    <td className="px-5 py-4 text-[13px] font-semibold text-charcoal">
                      {order.id}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-charcoal">
                      {order.customerName}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-teal">
                      ${order.totalAmount}
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
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
