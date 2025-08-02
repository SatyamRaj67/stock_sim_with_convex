"use client";

import { useCurrentRole } from "@/hooks/useCurrentRole";
import { FormError } from "@/components/form-error";
import type { UserRole } from "@/types";

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
  const role = useCurrentRole();

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
