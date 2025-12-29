import type { Transaction } from "@/lib/types";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc,
  orderBy
} from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

// This file will now interact with Firestore

async function getFirestoreAndUser() {
  const { firestore, auth } = initializeFirebase();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  return { firestore, user };
}

export async function getTransactions(): Promise<Transaction[]> {
  const { firestore, user } = await getFirestoreAndUser();
  const transactionsCol = collection(firestore, "users", user.uid, "transactions");
  const q = query(transactionsCol, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  
  const transactions: Transaction[] = [];
  querySnapshot.forEach((doc) => {
    transactions.push({ id: doc.id, ...doc.data() } as Transaction);
  });
  return transactions;
}

export async function addTransaction(transaction: Omit<Transaction, "id" | "userId">): Promise<Transaction> {
  const { firestore, user } = await getFirestoreAndUser();
  const transactionsCol = collection(firestore, "users", user.uid, "transactions");
  
  const newTransactionData = {
    ...transaction,
    userId: user.uid,
    date: new Date(transaction.date).toISOString()
  };

  const docRef = await addDoc(transactionsCol, newTransactionData);
  return { id: docRef.id, ...newTransactionData };
}

export async function updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'userId'>>): Promise<Transaction> {
  const { firestore, user } = await getFirestoreAndUser();
  const transactionDoc = doc(firestore, "users", user.uid, "transactions", id);
  
  const updateData = { ...updates };
  if (updates.date) {
    updateData.date = new Date(updates.date).toISOString();
  }

  await updateDoc(transactionDoc, updateData);

  const updatedTransaction: Transaction = {
    id: id,
    userId: user.uid,
    type: updates.type!,
    amount: updates.amount!,
    category: updates.category!,
    date: updates.date!,
    description: updates.description,
  }
  return updatedTransaction;
}

export async function deleteTransaction(id: string): Promise<{ success: boolean }> {
  const { firestore, user } = await getFirestoreAndUser();
  const transactionDoc = doc(firestore, "users", user.uid, "transactions", id);
  await deleteDoc(transactionDoc);
  return { success: true };
}