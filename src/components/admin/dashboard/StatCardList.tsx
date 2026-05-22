import { getStatData } from "@/actions/stat";
import Link from "next/link";

const StatCardList = async () => {
  const response = await getStatData();

  const stats = [
    {
      label: "Total Products",
      value: response.data.totalOrders,
      icon: "◈",
      color: "text-teal",
      bg: "bg-teal-pale",
      href: "/admin/products",
    },
    {
      label: "Pending Orders",
      value: response.data.totalPendingOrders,
      icon: "✦",
      color: "text-gold-dark",
      bg: "bg-amber-50",
      href: "/admin/orders",
    },
    {
      label: "Upcoming Workshops",
      value: response.data.totalUpcomingWorkshops,
      icon: "◆",
      color: "text-navy",
      bg: "bg-blush-light",
      href: "/admin/workshops",
    },
    {
      label: "Total Orders",
      value: response.data.totalOrders,
      icon: "▪",
      color: "text-charcoal",
      bg: "bg-light-gray",
      href: "/admin/orders",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
      {stats.map((s) => (
        <Link key={s.label} href={s.href}>
          <div className="bg-white border border-light-gray p-5 sm:p-7 hover:border-gold transition-all duration-300 cursor-pointer h-full">
            <div
              className={`inline-flex items-center justify-center w-10 h-10 rounded-sm ${s.bg} ${s.color} text-[20px] mb-4`}
            >
              {s.icon}
            </div>
            <div
              className={`text-[clamp(28px,3vw,40px)] font-semibold ${s.color} leading-none mb-1`}
            >
              {s.value}
            </div>
            <div className="text-[12px] sm:text-[13px] text-gray tracking-wide uppercase">
              {s.label}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default StatCardList;
