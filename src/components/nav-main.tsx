"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

/**
 * The main navigation.
 *
 * @param props The props.
 * @param props.items The items.
 * @returns The rendered navigation.
 */
export function NavMain({
  items,
}: {
  items: Array<{
    title: string;
    url: string;
    icon?: Icon;
  }>;
}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={pathname === item.url}
                tooltip={item.title}
                onClick={() => {
                  setOpenMobile(false);
                }}
                asChild
              >
                <Link href={item.url}>
                  {item.icon != null && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
