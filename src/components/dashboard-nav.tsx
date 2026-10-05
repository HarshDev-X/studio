'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, List, Settings, Star, MessageSquare } from 'lucide-react';
import { RateAppDialog } from '@/components/rate-app-dialog';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/transactions', label: 'Transactions', icon: List },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const [rateDialogOpen, setRateDialogOpen] = useState(false);

  // WhatsApp configuration with your phone number
  const whatsappNumber = '918923356413'; 
  const whatsappMessage = encodeURIComponent('Hello! I am using Verma Expenses app and need some assistance.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

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
          {/* Rate Us Option */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setRateDialogOpen(true)}
              tooltip="Rate Us"
              className="justify-start text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>Rate Us</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Contact Us WhatsApp Option */}
          <SidebarMenuItem>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
              <SidebarMenuButton tooltip="Contact Us" className="justify-start text-muted-foreground hover:text-foreground">
                <MessageSquare className="h-4 w-4 text-emerald-500" />
                <span>Contact Us</span>
              </SidebarMenuButton>
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>

      {/* Star Rating Dialog Component */}
      <RateAppDialog open={rateDialogOpen} onOpenChange={setRateDialogOpen} />
    </div>
  );
}
