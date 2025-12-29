'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addTransaction, updateTransaction, deleteTransaction } from './data';
import { transactionCategories } from './types';

const transactionSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.coerce.number().positive('Amount must be positive'),
    category: z.enum(transactionCategories),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    description: z.string().optional(),
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
