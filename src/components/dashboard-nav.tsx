'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, List, Settings } from 'lucide-react';

const links = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: Home,
  },
  {
    href: '/dashboard/transactions',
    label: 'Transactions',
    icon: List,
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
  }
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <Link href={link.href}>
            <SidebarMenuButton
              isActive={pathname === link.href}
              tooltip={link.label}
              className="justify-start"
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
