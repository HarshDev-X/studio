'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { updateProfileAction } from '@/lib/actions';
import { useEffect, useState } from 'react';
import { signOut, deleteUser } from 'firebase/auth';
import { LogOut, Moon, Sun, Laptop, Save, FileText, Shield, Trash2, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { collection, query, writeBatch } from 'firebase/firestore';
import type { Transaction } from '@/lib/types';


const profileSchema = z.object({
  displayName: z.string().min(1, 'Name is required'),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfileTab() {
  const { user } = useFirebase();
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName || '',
        email: user.email || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfileAction(data);
      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          This is how others will see you on the site.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Full Name</Label>
            <Input
              id="displayName"
              {...register('displayName')}
            />
            {errors.displayName && (
              <p className="text-sm text-red-500">
                {errors.displayName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              readOnly
              className="bg-muted"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2" />
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function AppearanceTab() {
  const { setTheme, theme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Theme</Label>
          <p className="text-sm text-muted-foreground">Select the color scheme for the interface.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')} className="flex-1">
            <Sun className="mr-2" /> Light
          </Button>
          <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')} className="flex-1">
            <Moon className="mr-2" /> Dark
          </Button>
          <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')} className="flex-1">
            <Laptop className="mr-2" /> System
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function SpendingTab() {
  const [budgetMode, setBudgetMode] = useState(false);
  const [carryOver, setCarryOver] = useState(false);
  
  return (
     <Card>
        <CardHeader>
          <CardTitle>Spending</CardTitle>
          <CardDescription>
            Manage your budgeting and spending preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div>
              <Label className="text-base font-medium">Budget Mode</Label>
              <p className="text-sm text-muted-foreground">Enable to set and track monthly budgets for categories.</p>
           </div>
            <div className="flex items-center space-x-2">
                <Switch id="budget-mode" checked={budgetMode} onCheckedChange={setBudgetMode} />
                <Label htmlFor="budget-mode">Enable Budgeting</Label>
            </div>
          <Separator />
           <div>
              <Label className="text-base font-medium">Budget Carry-over</Label>
              <p className="text-sm text-muted-foreground">Carry over unused budget amounts to the next month.</p>
           </div>
           <div className="flex items-center space-x-2">
                <Switch id="carry-over" checked={carryOver} onCheckedChange={setCarryOver} disabled={!budgetMode} />
                <Label htmlFor="carry-over" className={!budgetMode ? 'text-muted-foreground' : ''}>Enable Carry-over</Label>
            </div>
        </CardContent>
      </Card>
  );
}

function DataPrivacyTab() {
  const { auth, firestore, user } = useFirebase();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const transactionsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'transactions'));
  }, [firestore, user]);

  const { data: transactions, isLoading } = useCollection(transactionsQuery);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const handleExportData = () => {
    if (!transactions) {
      toast({
        variant: 'destructive',
        title: 'No data to export',
        description: 'There are no transactions to export.',
      });
      return;
    }

    const headers = ['id', 'type', 'amount', 'category', 'date', 'description'];
    const csvContent = [
      headers.join(','),
      ...transactions.map((t: Transaction) =>
        [
          t.id,
          t.type,
          t.amount,
          t.category,
          t.date,
          `"${t.description?.replace(/"/g, '""') || ''}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Success', description: 'Your data has been exported.' });
  };
  
  const handleDeleteAccount = async () => {
    if (!firestore || !user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }
    setIsDeleting(true);

    try {
      // 1. Delete all transactions in a batch
      const transactionsRef = collection(firestore, 'users', user.uid, 'transactions');
      const batch = writeBatch(firestore);
      const querySnapshot = await query(transactionsRef).get();
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      
      // 2. Delete user data from 'users' collection (if it exists)
      // await deleteDoc(doc(firestore, 'users', user.uid));

      // 3. Delete the user from Firebase Auth
      await deleteUser(user);

      toast({ title: 'Account Deleted', description: 'Your account and all associated data have been permanently deleted.' });
      // The onAuthStateChanged listener will handle redirecting the user.
    } catch (error: any) {
      console.error("Account deletion failed:", error);
      toast({
        variant: 'destructive',
        title: 'Account Deletion Failed',
        description: error.message || 'An error occurred. You may need to re-authenticate to delete your account.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>
            Manage your personal data and account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" onClick={handleExportData} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 animate-spin"/> : <FileText className="mr-2" />}
              {isLoading ? 'Loading data...' : 'Export My Data'}
            </Button>
            <p className="text-sm text-muted-foreground px-1">Download a copy of all your transaction data.</p>
        </CardContent>
      </Card>
      <Card>
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
            <CardDescription>
              Logout or permanently delete your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" onClick={handleSignOut} className="w-full">
              <LogOut className="mr-2" />
              Log Out
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full" disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="mr-2 animate-spin"/> : <Trash2 className="mr-2" />}
                    {isDeleting ? 'Deleting Account...' : 'Delete My Account'}
                  </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all of your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
             <p className="text-sm text-muted-foreground px-1">Warning: This action is permanent and cannot be undone.</p>
          </CardContent>
        </Card>
    </div>
  )
}


export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-headline font-bold tracking-tight">
        Settings
      </h2>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>
        <TabsContent value="spending">
          <SpendingTab />
        </TabsContent>
        <TabsContent value="data">
          <DataPrivacyTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
