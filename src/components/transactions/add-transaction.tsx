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
import { Button } from '../ui/button';
import TransactionForm from './transaction-form';
import { PlusCircle } from 'lucide-react';

export default function AddTransaction() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Add a new income or expense to your records.
          </DialogDescription>
        </DialogHeader>
        <TransactionForm onFinished={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
