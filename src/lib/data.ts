import type { Transaction } from "@/lib/types";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc,
  Firestore
} from "firebase/firestore";

export async function addTransaction(
  db: Firestore, 
  userId: string, 
  transaction: Omit<Transaction, "id" | "userId">
): Promise<Transaction> {
  const transactionsCol = collection(db, "users", userId, "transactions");
  
  const newTransactionData = {
    ...transaction,
    userId: userId,
    createdAt: new Date().toISOString(),
    date: new Date(transaction.date).toISOString()
  };

  const docRef = await addDoc(transactionsCol, newTransactionData);
  return { id: docRef.id, ...newTransactionData };
}

export async function updateTransaction(
  db: Firestore,
  userId: string,
  id: string, 
  updates: Partial<Omit<Transaction, 'id' | 'userId'>>
): Promise<void> {
  const transactionDoc = doc(db, "users", userId, "transactions", id);
  
  const updateData: any = { ...updates };
  if (updates.date) {
    updateData.date = new Date(updates.date).toISOString();
  }

  await updateDoc(transactionDoc, updateData);
}

export async function deleteTransaction(db: Firestore, userId: string, id: string): Promise<void> {
  const transactionDoc = doc(db, "users", userId, "transactions", id);
  await deleteDoc(transactionDoc);
}
