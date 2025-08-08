"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { InfoCard } from "@/components/card/info-card";
import { DashboardChart } from "@/components/charts/dashboard-chart";
import { formatToCurrency } from "@/lib/format";

export default function DashboardPage() {
  const session = useSession();

  if (!session?.data?.user) {
    redirect("/auth/signin");
  }

  const userData = useQuery(api.userData.getUserDataByUserId, {
    userId: session?.data.user?.id,
  });

  return (
    <div className="w-full flex-1 space-y-4 p-2 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InfoCard title="Balance" value={formatToCurrency(userData?.balance)} />

        <InfoCard
          title="Portfolio Value"
          value={formatToCurrency(userData?.portfolioValue)}
        />

        <InfoCard
          title="Total Profit"
          value={formatToCurrency(userData?.totalProfit)}
        />

        <InfoCard
          title="Total Investment"
          value={formatToCurrency(userData?.totalInvestment)}
        />
      </div>

      <DashboardChart />
    </div>
  );
}
