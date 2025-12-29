'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import TransactionForm from './transaction-form';
import { Transaction } from '@/lib/types';

interface EditTransactionProps {
    transaction: Transaction;
    children: React.ReactNode;
}

export default function EditTransaction({ transaction, children }: EditTransactionProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Update the details of your transaction.
          </DialogDescription>
        </DialogHeader>
        <TransactionForm transaction={transaction} onFinished={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
