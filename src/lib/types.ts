export type Transaction = {
  id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  category: TransactionCategory;
  date: string;
  description?: string;
};

export const transactionCategories = [
  "Food",
  "Travel",
  "Rent",
  "Hostel",
  "Shopping",
  "Bills",
  "Others",
] as const;

export type TransactionCategory = (typeof transactionCategories)[number];
