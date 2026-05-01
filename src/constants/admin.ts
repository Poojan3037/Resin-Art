export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: string;
  date: string;
  status: OrderStatus;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001",
    customer: "Emily Carter",
    email: "emily.carter@email.com",
    product: "Ocean Wave Resin Tray",
    amount: "$145",
    date: "Apr 28, 2026",
    status: "Delivered",
  },
  {
    id: "ORD-002",
    customer: "Priya Mehta",
    email: "priya.mehta@email.com",
    product: "Gold Geode Coaster Set",
    amount: "$68",
    date: "Apr 27, 2026",
    status: "Shipped",
  },
  {
    id: "ORD-003",
    customer: "Sophie Nguyen",
    email: "sophie.nguyen@email.com",
    product: "Resin Jewellery Set",
    amount: "$55",
    date: "Apr 25, 2026",
    status: "Processing",
  },
  {
    id: "ORD-004",
    customer: "Aisha Rahman",
    email: "aisha.r@email.com",
    product: "Abstract Fluid Art — A2",
    amount: "$310",
    date: "Apr 25, 2026",
    status: "Pending",
  },
  {
    id: "ORD-005",
    customer: "Laura Bennet",
    email: "laura.b@email.com",
    product: "Teal Pour Painting — A3",
    amount: "$220",
    date: "Apr 24, 2026",
    status: "Delivered",
  },
  {
    id: "ORD-006",
    customer: "Natasha Singh",
    email: "natasha.s@email.com",
    product: "Marble Effect Coaster",
    amount: "$38",
    date: "Apr 23, 2026",
    status: "Delivered",
  },
  {
    id: "ORD-007",
    customer: "Grace Okafor",
    email: "grace.o@email.com",
    product: "Gold Geode Coaster Set",
    amount: "$68",
    date: "Apr 22, 2026",
    status: "Cancelled",
  },
  {
    id: "ORD-008",
    customer: "Maya Patel",
    email: "maya.p@email.com",
    product: "Ocean Wave Resin Tray",
    amount: "$145",
    date: "Apr 20, 2026",
    status: "Delivered",
  },
  {
    id: "ORD-009",
    customer: "Chloe Thompson",
    email: "chloe.t@email.com",
    product: "Abstract Fluid Art — A2",
    amount: "$310",
    date: "Apr 18, 2026",
    status: "Delivered",
  },
  {
    id: "ORD-010",
    customer: "Riya Desai",
    email: "riya.d@email.com",
    product: "Resin Jewellery Set",
    amount: "$55",
    date: "Apr 17, 2026",
    status: "Shipped",
  },
  {
    id: "ORD-011",
    customer: "Isabella Ross",
    email: "isabella.r@email.com",
    product: "Teal Pour Painting — A3",
    amount: "$220",
    date: "Apr 15, 2026",
    status: "Processing",
  },
  {
    id: "ORD-012",
    customer: "Amara Williams",
    email: "amara.w@email.com",
    product: "Marble Effect Coaster",
    amount: "$38",
    date: "Apr 14, 2026",
    status: "Pending",
  },
  {
    id: "ORD-013",
    customer: "Zoe Martin",
    email: "zoe.m@email.com",
    product: "Gold Geode Coaster Set",
    amount: "$136",
    date: "Apr 12, 2026",
    status: "Delivered",
  },
  {
    id: "ORD-014",
    customer: "Hana Kimura",
    email: "hana.k@email.com",
    product: "Ocean Wave Resin Tray",
    amount: "$145",
    date: "Apr 10, 2026",
    status: "Delivered",
  },
  {
    id: "ORD-015",
    customer: "Nina Johansson",
    email: "nina.j@email.com",
    product: "Abstract Fluid Art — A2",
    amount: "$310",
    date: "Apr 8, 2026",
    status: "Cancelled",
  },
];
