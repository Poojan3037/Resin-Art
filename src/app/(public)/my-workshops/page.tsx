import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { verifyUserSession } from "@/actions/dal";
import { getMyWorkshopBookings } from "@/actions/workshop";
import {
  formatWorkshopDate,
  formatWorkshopTime,
} from "@/lib/workshop-time-formatter";
import Pagination from "@/components/Pagination";
import { MY_WORKSHOPS_PAGE_SIZE } from "@/constants/workshops";

export const metadata: Metadata = {
  title: "My Workshops",
  robots: {
    index: false,
    follow: false,
  },
};

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

type Props = {
  searchParams: Promise<{ page?: string }>;
};

const MyWorkshopsPage = async ({ searchParams }: Props) => {
  const { isUserVerified } = await verifyUserSession();
  if (!isUserVerified) {
    redirect("/login?redirect=/my-workshops");
  }

  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);

  const { bookings, totalCount } = await getMyWorkshopBookings(page);
  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / MY_WORKSHOPS_PAGE_SIZE),
  );

  return (
    <div className="max-w-5xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
      <h1 className="text-[clamp(30px,4vw,46px)] font-semibold text-charcoal mb-8">
        My Workshops
      </h1>

      {bookings.length === 0 ? (
        <div className="bg-white border border-light-gray p-10 sm:p-12 text-center">
          <h3 className="text-[20px] sm:text-[24px] text-charcoal mb-2.5">
            You haven&apos;t booked any workshops yet.
          </h3>
          <Link
            href="/workshops"
            className="inline-block mt-6 text-[12px] tracking-[0.14em] uppercase text-gold hover:underline"
          >
            Browse Workshops
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-light-gray">
                  {[
                    "Workshop",
                    "Date & Time",
                    "Location",
                    "Seats",
                    "Payment",
                    "Total",
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
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-light-gray/60 hover:bg-cream/40 transition-colors"
                  >
                    <td className="py-4 pr-6 text-[13px] font-medium text-charcoal max-w-60">
                      {booking.workshop.title}
                    </td>
                    <td className="py-4 pr-6 text-[13px] text-gray whitespace-nowrap">
                      {formatWorkshopDate(booking.workshop.date)}
                      <br />
                      {formatWorkshopTime(booking.workshop)}
                    </td>
                    <td className="py-4 pr-6 text-[13px] text-gray">
                      {booking.workshop.location}
                    </td>
                    <td className="py-4 pr-6 text-[13px] text-charcoal text-center">
                      {booking.seatsBooked}
                    </td>
                    <td className="py-4 pr-6">
                      <span className="text-[11px] tracking-[0.15em] uppercase px-3 py-1 border border-gold text-gold">
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 pr-2 text-[13px] font-semibold text-charcoal">
                      {currencyFormatter.format(booking.totalCents / 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-light-gray p-5 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[15px] font-semibold text-charcoal">
                    {booking.workshop.title}
                  </span>
                  <span className="text-[11px] tracking-[0.15em] uppercase px-3 py-1 border border-gold text-gold">
                    {booking.paymentStatus}
                  </span>
                </div>

                <p className="text-[13px] text-gray">
                  {formatWorkshopDate(booking.workshop.date)} ·{" "}
                  {formatWorkshopTime(booking.workshop)}
                </p>
                <p className="text-[13px] text-gray">
                  {booking.workshop.location}
                </p>

                <div className="border-t border-light-gray pt-3 flex justify-between text-[14px] font-semibold">
                  <span>
                    {booking.seatsBooked} seat
                    {booking.seatsBooked > 1 ? "s" : ""}
                  </span>
                  <span className="text-gold">
                    {currencyFormatter.format(booking.totalCents / 100)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/my-workshops"
          />
        </>
      )}
    </div>
  );
};

export default MyWorkshopsPage;
