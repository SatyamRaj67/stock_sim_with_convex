"use client";

import * as React from "react";

import { TbInnerShadowTop } from "react-icons/tb";

import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { NavMain } from "@/components/layout/sidebar/nav-main";
import { NavSecondary } from "@/components/layout/sidebar/nav-secondary";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import { NavAdmin } from "@/components/layout/sidebar/nav-admin";

import { usePathname } from "next/navigation";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@/types";
import { navData } from "@/constants/nav-data";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const user = useQuery(
    api.user.getUserById,
    session?.data?.user?.id ? { id: session.data.user.id } : "skip",
  );

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              onClick={handleLinkClick}
              isActive={pathname === "/"}
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <TbInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SmartStock</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
        <RoleGate allowedRoles={UserRole.ADMIN}>
          <NavAdmin items={navData.navAdmin} />
        </RoleGate>

        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
