import { getRegistrations, getWorkShopById } from "@/actions/workshop";
import RegistrationsSection from "@/components/admin/registrations/RegistrationsSection";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const AdminWorkshopRegistrationsPage = async ({
  params,
  searchParams,
}: Props) => {
  const { id } = await params;
  const query = await searchParams;

  const [workshop, registrations] = await Promise.all([
    getWorkShopById(id),
    getRegistrations({
      workshopId: id,
      search: (query?.search as string) ?? "",
      paymentStatus: (query?.status as string) ?? "",
    }),
  ]);

  if (!workshop) notFound();

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <Link
          href="/admin/workshops"
          className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase font-semibold text-gray hover:text-charcoal transition-colors"
        >
          ← Back to Workshops
        </Link>
      </div>
      <RegistrationsSection
        data={registrations}
        workshopTitle={workshop.title}
      />
    </>
  );
};

export default AdminWorkshopRegistrationsPage;
