"use client";

import InfoCard from "@/components/card/info-card";
import { StockChart } from "@/components/charts/stock-chart";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Wallet } from "lucide-react";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = useQuery(api.user.getUserById, { id: session!.user.id });
  return (
    <div className="container flex-1 space-y-4 p-2 pt-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InfoCard title="Portfolio Value" value={"under construction"} />
        <InfoCard
          title="Available Balance"
          value={user?.balance ? `$${user.balance.toLocaleString()}` : "$0"}
          description="The current balance of the user."
          icon={<Wallet className="h-4 w-4" />}
          badge={{ text: "New" }}
        />
        <InfoCard title="Market Overview" value={"under construction"} />
        <InfoCard
          title="Gain/Loss from last time"
          value={"under construction"}
        />
      </div>
      <StockChart />
    </div>
  );
}
