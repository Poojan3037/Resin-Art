import { getPublicWorkshopById } from "@/actions/workshop";
import ImageGallery from "@/components/media/ImageGallery";
import WorkshopDetailBookingLauncher from "@/components/workshop/WorkshopDetailBookingLauncher";
import {
  formatWorkshopDate,
  formatWorkshopTime,
} from "@/lib/workshop-time-formatter";
import Link from "next/link";
import { notFound } from "next/navigation";

type WorkshopDetailPagePropsType = {
  params: Promise<{
    id: string;
  }>;
};

const WorkshopDetailPage = async ({ params }: WorkshopDetailPagePropsType) => {
  const { id } = await params;
  const workshop = await getPublicWorkshopById(id);

  if (!workshop) {
    notFound();
  }

  const timeLabel = formatWorkshopTime({
    startTime: workshop.startTime,
    startPeriod: workshop.startPeriod,
    endTime: workshop.endTime,
    endPeriod: workshop.endPeriod,
  });
  const dateLabel = formatWorkshopDate(workshop.date);

  return (
    <div className="max-w-7xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
      <Link
        href="/workshops"
        className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase font-semibold text-gray hover:text-charcoal transition-colors mb-8"
      >
        ← Back to Workshops
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <ImageGallery
            bannerUrl={workshop.bannerUrl ?? "/images/art/art-1.jpg"}
            bannerAlt={workshop.title}
            images={workshop.images}
          />
        </div>

        <div>
          <span
            className={
              workshop.availableSeats <= 3
                ? "bg-amber-100 text-amber-700 text-[11px] px-3 py-1 uppercase tracking-widest font-semibold"
                : "bg-teal-50 text-teal text-[11px] px-3 py-1 uppercase tracking-widest font-semibold"
            }
          >
            {workshop.availableSeats} seats left
          </span>

          <h1 className="text-[clamp(28px,4vw,48px)] font-semibold text-charcoal mt-4">
            {workshop.title}
          </h1>

          <div className="mt-4">
            <span className="text-[30px] font-semibold text-gold">
              ${workshop.price}
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            {[
              ["📅", dateLabel],
              ["🕐", timeLabel],
              ["📍", workshop.location],
            ].map(([ic, val]) => (
              <div key={val} className="flex gap-2.5 items-center">
                <span className="text-[13px]">{ic}</span>
                <span className="text-[14px] text-gray">{val}</span>
              </div>
            ))}
          </div>

          {workshop.description && (
            <p className="text-gray mt-6 whitespace-pre-line">
              {workshop.description}
            </p>
          )}

          {workshop.availableSeats === 0 && (
            <div className="flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-2.5 mt-6">
              <span className="text-red-500 text-sm">⛔</span>
              <span className="text-red-600 text-[12px] uppercase tracking-widest font-semibold">
                Sold Out — No seats available
              </span>
            </div>
          )}

          <div className="mt-8">
            <WorkshopDetailBookingLauncher workshop={workshop} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetailPage;
