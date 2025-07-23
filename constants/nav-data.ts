import {
  TbAward,
  TbBroadcast,
  TbBuildingStore,
  TbCashRegister,
  TbChartBar,
  TbDashboard,
  TbFileDescription,
  TbHelp,
  TbReportAnalytics,
  TbSettings,
  TbTerminal,
} from "react-icons/tb";

export const navData = {
  navMain: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: TbDashboard,
    },
    {
      title: "Market",
      href: "/market",
      icon: TbChartBar,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: TbReportAnalytics,
    },
    {
      title: "Transactions",
      href: "/transactions",
      icon: TbCashRegister,
    },
    {
      title: "Achievements",
      href: "/achievements",
      icon: TbAward,
    }
  ],
  navAdmin: [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: TbTerminal,
    },
    {
      title: "Watchlist",
      href: "/admin/watchlist",
      icon: TbFileDescription,
    },
    {
      title: "Announcements",
      href: "/admin/announcements",
      icon: TbBroadcast,
    },
    {
      title: "Market",
      href: "/admin/market",
      icon: TbBuildingStore,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: TbSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: TbHelp,
    },
  ],
};
