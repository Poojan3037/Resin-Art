import EventDetailPage from "@/components/home/EventDetailPage";
import { GALLERY_SECTION_DATA } from "@/constants/home";

import { notFound } from "next/navigation";

export function generateStaticParams() {
  return GALLERY_SECTION_DATA.map((event) => ({ slug: event.slug }));
}

type PropsType = {
  params: Promise<{ slug: string }>;
};

const Page = async ({ params }: PropsType) => {
  const { slug } = await params;
  const event = GALLERY_SECTION_DATA.find((e) => e.slug === slug);

  if (!event) notFound();

  const relatedEvents = GALLERY_SECTION_DATA.filter((e) => e.slug !== slug);

  return <EventDetailPage event={event} relatedEvents={relatedEvents} />;
};

export default Page;
