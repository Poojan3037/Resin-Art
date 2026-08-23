import type { ProvinceCode, TaxLineType } from "@/lib/tax/canada";
import { WorkshopStatus } from "../../prisma/generated/prisma/client";

export type Workshop = {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  startPeriod: string;
  endTime: string;
  endPeriod: string;
  location: string;
  province: ProvinceCode | null;
  price: number;
  totalSeats: number;
  availableSeats: number;
  showToUsers: boolean;
  status: WorkshopStatus;
  /** ISO timestamp of the last subscriber announcement, null if never sent. */
  lastNotifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WorkshopActionState = {
  success: boolean;
  message: string;
} | null;

export type WorkshopEmailProps = {
  name: string;
  seats: number;
  subtotal: number;
  taxAmount: number;
  taxLines: TaxLineType[];
  totalPrice: number;
  supportEmail: string;
  workshop: {
    title: string;
    date: string;
    startTime: string;
    startPeriod: string;
    endTime: string;
    endPeriod: string;
    location: string;
    price: number;
  };
  receiptUrl?: string | null;
};

export type SendConfirmationArgs = {
  toName: string;
  toEmail: string;
  seats: number;
  subtotal: number;
  taxAmount: number;
  taxLines: TaxLineType[];
  totalPrice: number;
  workshop: WorkshopEmailProps["workshop"];
  receiptUrl?: string | null;
};
