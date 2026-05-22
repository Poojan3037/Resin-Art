"use client";

import { getRegistrations } from "@/actions/workshop";
import { useQueryState, debounce } from "nuqs";
import clsx from "clsx";
import { PaymentStatus } from "../../../../prisma/generated/prisma/client";

type Registration = Awaited<ReturnType<typeof getRegistrations>>[number];

type PropsType = {
  data: Registration[];
  workshopTitle?: string;
};

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  FAILED: "bg-red-50 text-red-600 border border-red-200",
  REFUNDED: "bg-blue-50 text-blue-700 border border-blue-200",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

const ALL_STATUSES: PaymentStatus[] = ["PENDING", "PAID", "FAILED", "REFUNDED"];

const RegistrationsSection = ({ data, workshopTitle }: PropsType) => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    limitUrlUpdates: debounce(500),
    shallow: false,
  });

  const [statusFilter, setStatusFilter] = useQueryState("status", {
    defaultValue: "",
    shallow: false,
  });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10">
        <span className="text-[11px] tracking-[0.22em] uppercase text-gold">
          {workshopTitle ? "Workshop" : "Manage"}
        </span>
        <h1 className="text-[clamp(28px,4vw,44px)] font-semibold text-charcoal mt-1">
          {workshopTitle ?? "Registrations"}
        </h1>
        <p className="text-[13px] text-gray mt-1">
          {data.length} registration{data.length === 1 ? "" : "s"} total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by name, email or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-light-gray bg-white px-4 py-2.5 text-[13px] text-charcoal placeholder:text-gray/60 focus:outline-none focus:border-gold transition-colors"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-light-gray bg-white px-4 py-2.5 text-[13px] text-charcoal focus:outline-none focus:border-gold transition-colors min-w-40"
        >
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {PAYMENT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {data.length === 0 ? (
        <div className="text-center py-20 text-gray text-[15px]">
          No registrations found.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-light-gray">
                  {[
                    "Name",
                    "Email",
                    "Phone",
                    "Workshop",
                    "Seats",
                    "Registered",
                    "Payment",
                  ].map((col) => (
                    <th
                      key={col}
                      className="pb-3 pr-6 text-[11px] tracking-[0.18em] uppercase text-gray font-semibold"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((registration) => (
                  <tr
                    key={registration.id}
                    className="border-b border-light-gray/60 hover:bg-cream/40 transition-colors"
                  >
                    <td className="py-4 pr-6 text-[13px] font-medium text-charcoal">
                      {registration.name}
                    </td>
                    <td className="py-4 pr-6 text-[13px] text-gray">
                      {registration.email}
                    </td>
                    <td className="py-4 pr-6 text-[13px] text-gray">
                      {registration.phone}
                    </td>
                    <td className="py-4 pr-6 text-[13px] text-charcoal max-w-50">
                      {registration.workshopTitle}
                    </td>
                    <td className="py-4 pr-6 text-[13px] text-charcoal text-center">
                      {registration.seatsBooked}
                    </td>
                    <td className="py-4 pr-6 text-[13px] text-gray whitespace-nowrap">
                      {formatDate(registration.registeredAt)}
                    </td>
                    <td className="py-4 pr-2">
                      <p
                        className={clsx(
                          "text-[11px] tracking-widest uppercase font-semibold px-3 py-1 border focus:outline-none transition-opacity",
                          PAYMENT_STATUS_STYLES[registration.paymentStatus],
                        )}
                      >
                        {registration.paymentStatus}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-4">
            {data.map((registration) => (
              <div
                key={registration.id}
                className="bg-white border border-light-gray p-5 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[15px] font-semibold text-charcoal">
                    {registration.name}
                  </span>
                  <p
                    className={clsx(
                      "text-[11px] tracking-widest uppercase font-semibold px-3 py-1 border focus:outline-none transition-opacity",
                      PAYMENT_STATUS_STYLES[registration.paymentStatus],
                    )}
                  >
                    {registration.paymentStatus}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[13px] text-gray">
                    {registration.email}
                  </span>
                  <span className="text-[13px] text-gray">
                    {registration.phone}
                  </span>
                </div>

                <div className="border-t border-light-gray pt-3 flex flex-col gap-1">
                  <span className="text-[13px] text-charcoal font-medium">
                    {registration.workshopTitle}
                  </span>
                  <div className="flex justify-between text-[12px] text-gray">
                    <span>
                      {registration.seatsBooked} seat
                      {registration.seatsBooked === 1 ? "" : "s"}
                    </span>
                    <span>{formatDate(registration.registeredAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RegistrationsSection;
