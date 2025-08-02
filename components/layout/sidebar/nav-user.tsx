"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import Image from "next/image";
import {
  TbCreditCard,
  TbDotsVertical,
  TbLogout,
  TbNotification,
  TbUserCircle,
} from "react-icons/tb";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/button/logout-button";
import type { Doc } from "@/convex/_generated/dataModel";

export function NavUser({ user }: { user?: Doc<"users"> }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.image ?? ""} />
                <AvatarFallback className="rounded-lg">
                  <Image
                    src={user?.image ?? "avatar.svg"}
                    alt="Avatar"
                    width={32}
                    height={32}
                  />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
              <TbDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.image ?? ""} alt="avatar" />
                  <AvatarFallback className="rounded-lg">
                    <Image
                      src={user?.image ?? "avatar.svg"}
                      alt="Avatar"
                      width={32}
                      height={32}
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <TbUserCircle />
                <Link href="/settings">Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TbCreditCard />
                <Link href="/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TbNotification />
                <Link href="/notifications">Notifications</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogoutButton>
                <div>
                  <TbLogout />
                  Log Out
                </div>
              </LogoutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
