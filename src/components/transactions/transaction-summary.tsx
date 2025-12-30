'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { summarizeTransactions, TransactionSummarizationOutput } from '@/ai/flows/transaction-summarization';
import type { Transaction } from '@/lib/types';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TransactionSummaryProps {
  transactions: Transaction[];
}

export default function TransactionSummary({ transactions }: TransactionSummaryProps) {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState<TransactionSummarizationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary(null);
    
    // Convert transactions to a plain, serializable format
    const serializableTransactions = transactions.map(t => ({
      ...t,
      // Ensure date is a string, which it should be based on Transaction type.
      date: typeof t.date === 'string' ? t.date : new Date(t.date).toISOString().split('T')[0],
      // Convert any other complex objects if necessary, though the schema seems simple.
    }));
    
    try {
      const result = await summarizeTransactions({ transactions: serializableTransactions });
      setSummary(result);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate AI summary. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Sparkles className="mr-2 h-4 w-4" />
          Get AI Summary
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => {
          if (!summary && !isLoading) {
            handleGenerateSummary();
          }
          e.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle>AI Spending Summary</DialogTitle>
          <DialogDescription>
            An AI-generated analysis of your spending habits and saving tips.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Analyzing transactions...</p>
            </div>
          )}
          {summary && (
            <div className="prose prose-sm max-w-none text-foreground">
              <p>{summary.summary}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
