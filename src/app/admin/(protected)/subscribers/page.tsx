import { getSubscriberCount, getSubscribers } from "@/actions/subscriber";
import SubscribersManager from "@/components/admin/subscribers/SubscribersManager";

type PagePropsType = {
  searchParams: Promise<{ search?: string }>;
};

const AdminSubscribersPage = async ({ searchParams }: PagePropsType) => {
  const { search = "" } = await searchParams;

  const [subscribers, totalCount] = await Promise.all([
    getSubscribers({ search }),
    getSubscriberCount(),
  ]);

  return (
    <SubscribersManager subscribers={subscribers} totalCount={totalCount} />
  );
};

export default AdminSubscribersPage;
