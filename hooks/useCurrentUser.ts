import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();

  if (!session.data?.user) {
    return null;
  }

  const user = useQuery(api.user.getUserById, { id: session.data?.user.id });

  if (!user) {
    return null;
  }

  return user;
};
