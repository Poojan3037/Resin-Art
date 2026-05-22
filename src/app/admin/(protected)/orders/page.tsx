import { getAdminOrders } from "@/actions/order";
import AdminOrdersManager from "@/components/admin/orders/AdminOrdersManager";
import { OrderStatus } from "../../../../../prisma/generated/prisma/client";

type PagePropsType = {
  searchParams: Promise<{ search?: string; status?: string }>;
};

const AdminOrdersPage = async ({ searchParams }: PagePropsType) => {
  const { search = "", status } = await searchParams;

  const validStatus =
    status &&
    status !== "ALL" &&
    Object.values(OrderStatus).includes(status as OrderStatus)
      ? (status as OrderStatus)
      : undefined;

  const orders = await getAdminOrders({ search, status: validStatus });

  return <AdminOrdersManager orders={orders} />;
};

export default AdminOrdersPage;
