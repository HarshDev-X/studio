'use server';

import { revalidatePath } from 'next/cache';
import { getAuthenticatedAppForUser } from '@/firebase/server-init';
import { updateProfile } from 'firebase/auth';

export async function revalidateTransactionsAction() {
    revalidatePath('/dashboard/transactions', 'layout');
    revalidatePath('/dashboard', 'layout');
}

export async function updateProfileAction(data: { displayName: string }) {
  const { app } = await getAuthenticatedAppForUser();
  if (!app || !app.auth.currentUser) {
    throw new Error('User not authenticated');
  }

  try {
    await updateProfile(app.auth.currentUser, {
      displayName: data.displayName,
    });
    revalidatePath('/dashboard/settings');
  } catch (error: any) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}
