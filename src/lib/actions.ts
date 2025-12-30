'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateTransactionsAction() {
    revalidatePath('/dashboard/transactions', 'layout');
    revalidatePath('/dashboard', 'layout');
}
