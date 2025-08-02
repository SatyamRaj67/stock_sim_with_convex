"use client";

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { redirect } from "next/navigation";

const ClientPage = () => {
  const user = useCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return <UserInfo label="📱Client Component" user={user} />;
};

export default ClientPage;
