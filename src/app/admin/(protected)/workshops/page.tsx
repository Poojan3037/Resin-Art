import { getAdminWorkshops } from "@/actions/workshop";
import { getSubscriberCount } from "@/actions/subscriber";
import WorkshopSection from "@/components/admin/workshops/WorkshopSection";

const INITIAL_WORKSHOPS = [
  {
    title: "Resin Fluid Art — Beginner Session",
    date: "May 18, 2026",
    startTime: "2:00",
    startPeriod: "PM",
    endTime: "5:00",
    endPeriod: "PM",
    location: "Studio 44, Calgary NW",
    price: "$85",
    seats: 6,
  },
  {
    title: "Sip & Create Resin Night",
    date: "May 25, 2026",
    startTime: "6:30",
    startPeriod: "PM",
    endTime: "9:30",
    endPeriod: "PM",
    location: "The Craft Lounge, Kensington",
    price: "$85",
    seats: 3,
  },
  {
    title: "Advanced Resin Techniques",
    date: "June 8, 2026",
    startTime: "1:00",
    startPeriod: "PM",
    endTime: "4:00",
    endPeriod: "PM",
    location: "Studio 44, Calgary NW",
    price: "$95",
    seats: 8,
  },
  {
    title: "Resin Tray & Coaster Workshop",
    date: "June 22, 2026",
    startTime: "3:00",
    startPeriod: "PM",
    endTime: "6:00",
    endPeriod: "PM",
    location: "Avenida Food Hall, High River",
    price: "$85",
    seats: 12,
  },
];

const AdminWorkshopsPage = async (props: PageProps<"/admin/workshops">) => {
  const query = await props.searchParams;

  const [workshops, subscriberCount] = await Promise.all([
    getAdminWorkshops({ search: (query?.search as string) ?? "" }),
    getSubscriberCount(),
  ]);

  return (
    <WorkshopSection data={workshops} subscriberCount={subscriberCount} />
  );
};

export default AdminWorkshopsPage;
