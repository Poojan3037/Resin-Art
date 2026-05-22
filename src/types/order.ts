import { OrderStatus } from "../../prisma/generated/prisma/client";

export type OrderItemType = {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  artistName: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  createdAt: string;
};

export type OrderPaymentType = {
  id: string;
  squarePaymentId: string | null;
  amountCents: number;
  currency: string;
  status: string;
  receiptUrl: string | null;
  paidAt: string;
};

export type OrderType = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  subtotal: string;
  shippingCost: string;
  totalAmount: string;
  status: OrderStatus;
  customerNotes: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderWithItemsType = OrderType & {
  items: OrderItemType[];
  payment: OrderPaymentType | null;
};

export type OrderActionStateType = {
  success: boolean;
  message: string;
  orderNumber?: string;
} | null;
