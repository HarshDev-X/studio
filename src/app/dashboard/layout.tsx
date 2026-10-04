'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import DashboardNav from '@/components/dashboard-nav';
import UserNav from '@/components/user-nav';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Share2, Star, Loader2 } from 'lucide-react';
import ShareAppDialog from '@/components/dashboard/share-app-dialog';
import RateAppDialog from '@/components/dashboard/rate-app-dialog';
import { doc, getDoc } from 'firebase/firestore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firestore, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const isPhoneVerified = localStorage.getItem('user_verified') === 'true';

    if (isUserLoading) return;

    if (!user && !isPhoneVerified) {
      router.replace('/login');
      return;
    }

    if (firestore && user) {
      const checkOnboarding = async () => {
        const userDocRef = doc(firestore, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists() && !userDoc.data()?.onboardingCompleted) {
            router.replace('/onboarding');
          } else {
            setIsCheckingOnboarding(false);
          }
        } catch (e) {
          setIsCheckingOnboarding(false);
        }
      };
      checkOnboarding();
    } else {
      setIsCheckingOnboarding(false);
    }
  }, [user, isUserLoading, firestore, router]);

  if (isUserLoading || isCheckingOnboarding) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-headline text-lg font-bold">VERMA & CO.</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <DashboardNav />
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <UserNav />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <ShareAppDialog />
              <RateAppDialog />
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
