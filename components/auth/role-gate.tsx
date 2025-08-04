"use client";

import { FormError } from "@/components/form-error";
import type { UserRole } from "@/types";
import { useSession } from "next-auth/react";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole;
  message?: string;
  showMessage?: boolean;
}

export const RoleGate = ({
  children,
  allowedRoles,
  message,
  showMessage,
}: RoleGateProps) => {
  const role = useSession().data?.user?.role;

  if (role !== allowedRoles) {
    if (showMessage) {
      return (
        <FormError
          message={
            message ?? "You do not have permission to view this content!"
          }
        />
      );
    }
    return null;
  }

  return <>{children}</>;
};
