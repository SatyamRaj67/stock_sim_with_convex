"use client";

import { useCurrentRole } from "@/hooks/useCurrentRole";
import { FormError } from "@/components/form-error";
import type { UserRole } from "@/types";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole;
  showMessage?: boolean;
  message?: string;
}

export const RoleGate = ({ children, allowedRoles, showMessage, message }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRoles) {
    if (showMessage) {
      return (
        <FormError message={message || "You do not have permission to view this content!"} />
      );
    }
    return null;
  }

  return <>{children}</>;
};
