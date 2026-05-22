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
  price: number;
  totalSeats: number;
  availableSeats: number;
  showToUsers: boolean;
  status: WorkshopStatus;
  createdAt: string;
  updatedAt: string;
};

export type WorkshopActionState = {
  success: boolean;
  message: string;
} | null;
