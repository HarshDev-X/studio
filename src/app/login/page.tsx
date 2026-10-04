'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/logo';
import { useFirebase } from '@/firebase';
import { initiatedEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PhoneAuthForm from '@/components/phone-auth-form';

export default function LoginPage() {
  const { auth, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('email');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth) return;

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const rememberMe = formData.get('remember-me') === 'on';

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      initiatedEmailSignIn(auth, email, password);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
      <div className="mx-auto max-w-sm w-full">
        <div className="text-center mb-4 flex justify-center items-center gap-2">
          <Logo />
          <h1 className="text-2xl font-headline font-bold text-primary">
            VERMA & CO.
          </h1>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md border">
          <h2 className="text-2xl font-headline font-bold text-center">Login</h2>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Sign in to your account to continue
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleLogin} className="grid gap-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" name="password" type="password" required />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember-me" name="remember-me" />
                  <Label htmlFor="remember-me" className="text-sm font-medium">Remember me</Label>
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </TabsContent>

            <TabsContent value="phone">
              <div className="mt-4">
                <PhoneAuthForm />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
