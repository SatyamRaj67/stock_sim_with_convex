"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { InfoCard } from "@/components/card/info-card";
import { DashboardChart } from "@/components/charts/dashboard-chart";
import { formatToCurrency } from "@/lib/format";
import { MotionWrapper } from "@/animations/motion-wrapper";
import { StaggerContainer } from "@/animations/stagger-container";
import { motion } from "framer-motion";

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
        <motion.h2
          className="text-3xl font-bold tracking-tight"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          Dashboard
        </motion.h2>

        <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MotionWrapper hover scale>
            <InfoCard
              title="Balance"
              value={formatToCurrency(userData?.balance)}
            />
          </MotionWrapper>

          <MotionWrapper hover scale>
            <InfoCard
              title="Portfolio Value"
              value={formatToCurrency(userData?.portfolioValue)}
            />
          </MotionWrapper>

          <MotionWrapper hover scale>
            <InfoCard
              title="Total Profit"
              value={formatToCurrency(userData?.totalProfit)}
            />
          </MotionWrapper>

          <MotionWrapper hover scale>
            <InfoCard
              title="Total Investment"
              value={formatToCurrency(userData?.totalInvestment)}
            />
          </MotionWrapper>
        </StaggerContainer>

        <MotionWrapper variant="slide-up" delay={0.5} hover scale>
          <DashboardChart />
        </MotionWrapper>
      </div>
  );
}
