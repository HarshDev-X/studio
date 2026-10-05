'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, List, Settings, Star, Mail } from 'lucide-react';

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
  },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between h-full">
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

      {/* Support & Feedback Links */}
      <div className="pt-4 border-t space-y-1 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <a href="https://forms.google.com" target="_blank" rel="noopener noreferrer" className="w-full">
              <SidebarMenuButton tooltip="Rate Us" className="justify-start text-muted-foreground hover:text-foreground">
                <Star className="h-4 w-4 text-amber-500" />
                <span>Rate Us</span>
              </SidebarMenuButton>
            </a>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <a href="mailto:support@vermaexpenses.com" className="w-full">
              <SidebarMenuButton tooltip="Contact Us" className="justify-start text-muted-foreground hover:text-foreground">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>Contact Us</span>
              </SidebarMenuButton>
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </div>
  );
}
