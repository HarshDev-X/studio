'use client';
import type { Transaction } from "@/lib/types";
import { 
  collection, 
  setDoc,
  updateDoc, 
  deleteDoc,
  doc,
  Firestore,
  serverTimestamp
} from "firebase/firestore";

export async function addTransaction(
  db: Firestore, 
  userId: string, 
  transaction: Omit<Transaction, "id" | "userId" | "createdAt">
) {
  const transactionsCol = collection(db, "users", userId, "transactions");
  // Create a new document reference with a unique ID
  const newTransactionRef = doc(transactionsCol);
  
  const newTransactionData = {
    ...transaction,
    id: newTransactionRef.id, // Add the document's ID to the data
    userId: userId,
    createdAt: serverTimestamp(),
    date: new Date(transaction.date).toISOString()
  };

  // Set the document with the new data
  await setDoc(newTransactionRef, newTransactionData);
  return { id: newTransactionRef.id, ...newTransactionData };
}

export async function updateTransaction(
  db: Firestore,
  userId: string,
  id: string, 
  updates: Partial<Omit<Transaction, 'id' | 'userId'>>
) {
  const transactionDoc = doc(db, "users", userId, "transactions", id);
  
  const updateData: any = { ...updates };
  if (updates.date) {
    updateData.date = new Date(updates.date).toISOString();
  }

  await updateDoc(transactionDoc, updateData);
}

export async function deleteTransaction(db: Firestore, userId: string, id: string) {
  const transactionDoc = doc(db, "users", userId, "transactions", id);
  await deleteDoc(transactionDoc);
}
