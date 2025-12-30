'use client';

import TransactionsTable from "@/components/transactions/transactions-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddTransaction from "@/components/transactions/add-transaction";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";


function TransactionsData() {
  const { firestore, user } = useFirebase();

  const transactionsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, "users", user.uid, "transactions"), orderBy("date", "desc"));
  }, [firestore, user]);

  const { data: transactions, isLoading } = useCollection(transactionsQuery);

  if (isLoading || !transactions) {
    return <TransactionsSkeleton />;
  }
  
  return <TransactionsTable transactions={transactions} />;
}

function TransactionsSkeleton() {
  return <Skeleton className="h-96 w-full" />;
}

export default function TransactionsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-headline font-bold tracking-tight">
          Transactions
        </h2>
        <AddTransaction />
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Your Transactions</CardTitle>
            <CardDescription>A list of all your recorded transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<TransactionsSkeleton />}>
              <TransactionsData />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
