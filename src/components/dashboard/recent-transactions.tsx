import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Transaction } from "@/lib/types";
import { IndianRupee } from 'lucide-react';
import { cn } from "@/lib/utils";

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="space-y-8">
      {transactions.map(transaction => (
          <div key={transaction.id} className="flex items-center">
            <Avatar className="h-9 w-9">
                <AvatarFallback>{transaction.category.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{transaction.description || transaction.category}</p>
                <p className="text-sm text-muted-foreground">{transaction.category} - {new Date(transaction.date).toLocaleDateString('en-IN')}</p>
            </div>
            <div className={cn(
                "ml-auto font-medium flex items-center",
                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                )}>
                {transaction.type === 'income' ? '+' : '-'}
                <IndianRupee className="h-4 w-4" />{transaction.amount.toLocaleString('en-IN')}
            </div>
          </div>
      ))}
    </div>
  );
}
