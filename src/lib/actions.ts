'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addTransaction, updateTransaction, deleteTransaction } from './data';
import { transactionCategories } from './types';
import { getAuth, updateProfile } from 'firebase/auth';
import { initializeFirebase } from '@/firebase/index';

const transactionSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.coerce.number().positive('Amount must be positive'),
    category: z.enum(transactionCategories),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    description: z.string().optional(),
});

const profileSchema = z.object({
  displayName: z.string().min(1, 'Name is required'),
});


export async function addTransactionAction(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = transactionSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        throw new Error('Invalid transaction data');
    }

    await addTransaction(validatedFields.data);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/transactions');
}

export async function updateTransactionAction(id: string, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = transactionSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        throw new Error('Invalid transaction data');
    }
    
    await updateTransaction(id, validatedFields.data);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/transactions');
}

export async function deleteTransactionAction(id: string) {
    await deleteTransaction(id);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/transactions');
}

export async function updateProfileAction(data: { displayName: string }) {
  const { auth } = initializeFirebase();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('You must be logged in to update your profile.');
  }

  const validatedFields = profileSchema.safeParse(data);

  if (!validatedFields.success) {
      throw new Error('Invalid profile data');
  }

  await updateProfile(currentUser, {
    displayName: validatedFields.data.displayName,
  });

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');
}