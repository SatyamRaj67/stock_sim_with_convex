import { UserInfo } from "@/components/user-info";
import { api } from "@/convex/_generated/api";
import { currentUser } from "@/lib/auth";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const ServerPage = async () => {
  const user = await fetchQuery(api.user.getUserById, {
    id: (await currentUser())!.id!,
  });

  if (!user) {
    redirect("/login");
  }
  
  return <UserInfo label="💻Server Component" user={user} />;
};

export default ServerPage;
