'use client';

import { useForm, Controller } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { updateProfileAction } from '@/lib/actions';
import { useEffect } from 'react';

const profileSchema = z.object({
  displayName: z.string().min(1, 'Name is required'),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-headline font-bold tracking-tight">
        Settings
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
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
                {errors.email && (
                  <p className="text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
