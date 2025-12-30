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
    if (isUserLoading) {
      return; 
    }
    if (!user) {
      router.replace('/login');
      return;
    }

    if (firestore) {
      const checkOnboarding = async () => {
        const userDocRef = doc(firestore, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists() || !userDoc.data()?.onboardingCompleted) {
            router.replace('/onboarding');
          } else {
            setIsCheckingOnboarding(false);
          }
        } catch (error) {
          console.error("Failed to check onboarding status:", error);
          // Potentially handle error, e.g., redirect to an error page
          setIsCheckingOnboarding(false);
        }
      };
      checkOnboarding();
    }
  }, [isUserLoading, user, firestore, router]);


  if (isUserLoading || isCheckingOnboarding) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo />
            <h1 className="text-xl font-headline font-bold text-primary">
              VERMA & CO.
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <DashboardNav />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-2">
            <ShareAppDialog>
              <Button variant="ghost" className="justify-start">
                <Share2 className="mr-2" />
                Share App
              </Button>
            </ShareAppDialog>
            <RateAppDialog>
              <Button variant="ghost" className="justify-start">
                <Star className="mr-2" />
                Rate App
              </Button>
            </RateAppDialog>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            {/* Can add breadcrumbs or search here */}
          </div>
          <UserNav />
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
