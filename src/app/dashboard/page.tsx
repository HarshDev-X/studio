'use client';

import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownRight,
  ArrowUpRight,
  IndianRupee,
} from "lucide-react";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import OverviewCharts from "@/components/dashboard/overview-charts";
import TransactionSummary from "@/components/transactions/transaction-summary";
import { Suspense, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { collection, query, orderBy, where } from "firebase/firestore";
import AddTransaction from "@/components/transactions/add-transaction";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import type { Transaction } from "@/lib/types";

function filterTransactionsByDateRange(transactions: Transaction[], dateRange?: DateRange) {
  if (!dateRange || (!dateRange.from && !dateRange.to)) {
    return transactions;
  }
  return transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const from = dateRange.from ? new Date(dateRange.from) : null;
    const to = dateRange.to ? new Date(dateRange.to) : null;

    if (from) from.setHours(0, 0, 0, 0);
    if (to) to.setHours(23, 59, 59, 999);

    if (from && to) {
      return transactionDate >= from && transactionDate <= to;
    }
    if (from) {
      return transactionDate >= from;
    }
    if (to) {
      return transactionDate <= to;
    }
    return true;
  });
}


function DashboardData() {
  const { firestore, user } = useFirebase();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const transactionsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, "users", user.uid, "transactions"), orderBy("date", "desc"));
  }, [firestore, user]);

  const { data: allTransactions, isLoading: isLoadingTransactions } = useCollection(transactionsQuery);

  const filteredTransactions = useMemo(() => {
    if (!allTransactions) return [];
    return filterTransactionsByDateRange(allTransactions, dateRange);
  }, [allTransactions, dateRange]);

  const recentTransactions = useMemo(() => {
    return filteredTransactions.slice(0, 5);
  }, [filteredTransactions]);


  if (isLoadingTransactions || !allTransactions) {
    return <DashboardSkeleton />;
  }

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-headline font-bold tracking-tight">
          Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          <AddTransaction />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <IndianRupee className="h-6 w-6 mr-1" />
              {totalIncome.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground">
              For the selected period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <IndianRupee className="h-6 w-6 mr-1" />
              {totalExpenses.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground">
              For the selected period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <IndianRupee className="h-6 w-6 mr-1" />
              {balance.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground">
              For the selected period
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-7">
          <OverviewCharts transactions={filteredTransactions} />
        </div>
        <Card className="col-span-7">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your latest transactions in the selected period.
                </CardDescription>
              </div>
              <TransactionSummary transactions={filteredTransactions} />
            </div>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={recentTransactions} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function DashboardSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-headline font-bold tracking-tight">
          Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[240px]" />
          <Skeleton className="h-10 w-[110px]" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle className="font-headline">Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[350px] w-full" />
            </CardContent>
        </Card>
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="font-headline">Expense by Category</CardTitle>
            </CardHeader>
            <CardContent>
                 <Skeleton className="h-[350px] w-full" />
            </CardContent>
        </Card>
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest income and expense transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}


export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  );
}
