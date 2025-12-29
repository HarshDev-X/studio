import { getTransactions } from "@/lib/data";
import TransactionsTable from "@/components/transactions/transactions-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddTransaction from "@/components/transactions/add-transaction";

export default async function TransactionsPage() {
  const transactions = await getTransactions();

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
            <TransactionsTable transactions={transactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
