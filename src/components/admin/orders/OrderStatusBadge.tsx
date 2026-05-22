import { OrderStatus } from "../../../../prisma/generated/prisma/client";

type OrderStatusBadgePropsType = {
  status: OrderStatus;
};

const statusClassMap: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-teal-50 text-teal border-teal-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-blush-light text-pink border-blush",
};

const OrderStatusBadge = ({ status }: OrderStatusBadgePropsType) => {
  return (
    <span
      className={`text-[11px] px-2.5 py-1 tracking-[0.12em] uppercase font-semibold border ${statusClassMap[status]}`}
    >
      {status}
    </span>
  );
};

export default OrderStatusBadge;
