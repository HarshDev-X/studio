'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useFirebase } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const avatars = PlaceHolderImages.filter(p => p.id.startsWith('user-avatar'));

export default function OnboardingPage() {
  const { auth, firestore, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [ledgerName, setLedgerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (!isUserLoading && user && firestore) {
      const checkOnboardingStatus = async () => {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().onboardingCompleted) {
          router.replace('/dashboard');
        } else {
          setCheckingStatus(false);
        }
      };
      checkOnboardingStatus();
    } else if (!isUserLoading && !user) {
        router.replace('/login');
    }
  }, [user, isUserLoading, firestore, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.currentUser || !firestore || !selectedAvatar || !ledgerName) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select an avatar and provide a ledger name.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        photoURL: selectedAvatar,
        displayName: auth.currentUser.displayName || ledgerName, 
      });

      // 2. Create or update user document in Firestore
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      await setDoc(userDocRef, {
        id: auth.currentUser.uid,
        name: auth.currentUser.displayName || ledgerName,
        email: auth.currentUser.email,
        photoURL: selectedAvatar,
        ledgerName: ledgerName,
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
      }, { merge: true });

      toast({
        title: 'Profile Created!',
        description: "Welcome! We're redirecting you to your dashboard.",
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Onboarding failed:', error);
      toast({
        variant: 'destructive',
        title: 'Onboarding Failed',
        description: error.message || 'An unexpected error occurred.',
      });
      setIsLoading(false);
    }
  };

  if (checkingStatus || isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Welcome to VERMA & CO.</CardTitle>
          <CardDescription>
            Let's get your account set up. Personalize your experience below.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <Label className="text-base font-medium">Choose Your Avatar</Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className="relative cursor-pointer"
                    onClick={() => setSelectedAvatar(avatar.imageUrl)}
                  >
                    <Image
                      src={avatar.imageUrl}
                      alt={avatar.description}
                      width={100}
                      height={100}
                      className={cn(
                        'rounded-full border-4 transition-all',
                        selectedAvatar === avatar.imageUrl
                          ? 'border-primary'
                          : 'border-transparent'
                      )}
                    />
                    {selectedAvatar === avatar.imageUrl && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-primary/50">
                        <Check className="h-8 w-8 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ledgerName" className="text-base font-medium">
                Name Your Expense Ledger
              </Label>
              <p className="text-sm text-muted-foreground">
                This will be the name of your primary expense book (e.g., "Personal Expenses", "My Budget").
              </p>
              <Input
                id="ledgerName"
                value={ledgerName}
                onChange={(e) => setLedgerName(e.target.value)}
                placeholder="e.g., My Personal Budget"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : null}
              {isLoading ? 'Saving...' : 'Complete Setup & Go to Dashboard'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
