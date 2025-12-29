import type { Transaction } from "@/lib/types";

// Mock user ID for development
const MOCK_USER_ID = "user_123";

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastMonth = new Date(today);
lastMonth.setMonth(lastMonth.getMonth() - 1);

export const mockTransactions: Transaction[] = [
  {
    id: "txn_1",
    userId: MOCK_USER_ID,
    type: "expense",
    amount: 4200,
    category: "Hostel",
    date: lastMonth.toISOString().split("T")[0],
    description: "Monthly hostel fees",
  },
  {
    id: "txn_2",
    userId: MOCK_USER_ID,
    type: "income",
    amount: 15000,
    category: "Others",
    date: lastMonth.toISOString().split("T")[0],
    description: "Monthly stipend",
  },
  {
    id: "txn_3",
    userId: MOCK_USER_ID,
    type: "expense",
    amount: 250,
    category: "Food",
    date: yesterday.toISOString().split("T")[0],
    description: "Lunch with friends",
  },
  {
    id: "txn_4",
    userId: MOCK_USER_ID,
    type: "expense",
    amount: 80,
    category: "Travel",
    date: yesterday.toISOString().split("T")[0],
    description: "Bus fare",
  },
  {
    id: "txn_5",
    userId: MOCK_USER_ID,
    type: "expense",
    amount: 1200,
    category: "Shopping",
    date: yesterday.toISOString().split("T")[0],
    description: "New headphones",
  },
  {
    id: "txn_6",
    userId: MOCK_USER_ID,
    type: "income",
    amount: 2000,
    category: "Others",
    date: today.toISOString().split("T")[0],
    description: "Freelance project payment",
  },
  {
    id: "txn_7",
    userId: MOCK_USER_ID,
    type: "expense",
    amount: 150,
    category: "Food",
    date: today.toISOString().split("T")[0],
    description: "Evening snacks",
  },
  {
    id: "txn_8",
    userId: MOCK_USER_ID,
    type: "expense",
    amount: 550,
    category: "Bills",
    date: today.toISOString().split("T")[0],
    description: "Phone bill",
  },
];

// In-memory store for transactions
let transactionsStore: Transaction[] = [...mockTransactions];

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getTransactions(): Promise<Transaction[]> {
  await delay(100);
  return transactionsStore.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addTransaction(transaction: Omit<Transaction, "id" | "userId">): Promise<Transaction> {
  await delay(100);
  const newTransaction: Transaction = {
    ...transaction,
    id: `txn_${Date.now()}`,
    userId: MOCK_USER_ID,
  };
  transactionsStore.unshift(newTransaction);
  return newTransaction;
}

export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
  await delay(100);
  let transactionToUpdate = transactionsStore.find(t => t.id === id);
  if (!transactionToUpdate) {
    throw new Error("Transaction not found");
  }
  transactionToUpdate = { ...transactionToUpdate, ...updates };
  transactionsStore = transactionsStore.map(t => (t.id === id ? transactionToUpdate! : t));
  return transactionToUpdate;
}

export async function deleteTransaction(id: string): Promise<{ success: boolean }> {
  await delay(100);
  const initialLength = transactionsStore.length;
  transactionsStore = transactionsStore.filter(t => t.id !== id);
  if (transactionsStore.length === initialLength) {
    throw new Error("Transaction not found");
  }
  return { success: true };
}
