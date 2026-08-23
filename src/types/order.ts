import { OrderStatus } from "../../prisma/generated/prisma/client";
import type { TaxLineType } from "@/lib/tax/canada";

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
  taxAmount: string;
  totalAmount: string;
  taxProvince: string | null;
  taxBreakdown: TaxLineType[] | null;
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

export type OrderItemArgs = {
  productTitle: string;
  artistName: string;
  quantity: number;
  unitPrice: string | number;
  lineTotal: string | number;
};

export type AddressArgs = {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type SendOrderConfirmationArgs = {
  toName: string;
  toEmail: string;
  orderNumber: string;
  orderId: string;
  items: OrderItemArgs[];
  subtotal: string | number;
  shippingCost: string | number;
  taxAmount: string | number;
  taxLines: TaxLineType[];
  totalAmount: string | number;
  address: AddressArgs;
  receiptUrl: string | null;
};

export type SendOrderStatusArgs = {
  toName: string;
  toEmail: string;
  orderNumber: string;
  orderId: string;
  status: OrderStatus;
};

export type AddressType = {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type StatusInfoType = {
  label: string;
  description: string;
  badgeColor: string;
  badgeTextColor: string;
};
