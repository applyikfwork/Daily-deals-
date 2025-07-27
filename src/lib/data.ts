
import { db } from '@/lib/firebase';
import type { Deal } from '@/lib/types';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
  documentId,
  writeBatch,
} from 'firebase/firestore';
import { subDays } from 'date-fns';

const dealsCollection = collection(db, 'deals');
const categoriesCollection = collection(db, 'categories');

// NOTE: The following functions now interact with Firestore.

export async function getDeals(filters: { query?: string, category?: string } = {}): Promise<Deal[]> {
  const now = new Date();
  const cutoff = subDays(now, 15);

  let q = query(
    dealsCollection,
    where('createdAt', '>=', Timestamp.fromDate(cutoff)),
    orderBy('createdAt', 'desc')
  );

  if (filters.category && filters.category !== 'all') {
    q = query(q, where('category', '==', filters.category));
  }
  
  const querySnapshot = await getDocs(q);
  let deals: Deal[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
    expireAt: (doc.data().expireAt as Timestamp).toDate().toISOString(),
  } as Deal));

  if (filters.query) {
    const lowercasedQuery = filters.query.toLowerCase();
    deals = deals.filter(deal =>
      deal.title.toLowerCase().includes(lowercasedQuery) ||
      deal.description.toLowerCase().includes(lowercasedQuery)
    );
  }

  return deals;
}


export async function getAllDealsForAdmin(): Promise<Deal[]> {
  const q = query(dealsCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
      expireAt: (doc.data().expireAt as Timestamp).toDate().toISOString(),
  } as Deal));
}

export async function getCategories(): Promise<string[]> {
  const querySnapshot = await getDocs(query(categoriesCollection, orderBy('name')));
  if (querySnapshot.empty) {
    const initialCategories = ["Mobile", "Electronics", "TV", "Fashion", "Appliances", "Books"];
    const batch = writeBatch(db);
    initialCategories.forEach(cat => {
      const docRef = doc(categoriesCollection);
      batch.set(docRef, { name: cat });
    });
    await batch.commit();
    return initialCategories.sort();
  }
  return querySnapshot.docs.map(doc => doc.data().name as string);
}

export async function addCategoryToDb(categoryName: string): Promise<string> {
  const trimmedName = categoryName.trim();
  
  const allCategories = await getCategories();
  if (allCategories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase())) {
     throw new Error(`Category "${trimmedName}" already exists.`);
  }

  await addDoc(categoriesCollection, { name: trimmedName });
  return trimmedName;
}

export async function addDealToDb(dealData: Omit<Deal, 'id' | 'createdAt'>): Promise<Deal> {
  const newDealData = {
    ...dealData,
    createdAt: Timestamp.now(),
    expireAt: Timestamp.fromDate(new Date(dealData.expireAt)),
  };
  const docRef = await addDoc(dealsCollection, newDealData);
  
  return {
    ...newDealData,
    id: docRef.id,
    createdAt: newDealData.createdAt.toDate().toISOString(),
    expireAt: newDealData.expireAt.toDate().toISOString(),
  };
}

export async function deleteDealFromDb(id: string): Promise<{ success: boolean }> {
  try {
    await deleteDoc(doc(db, 'deals', id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw new Error('Deal not found or could not be deleted');
  }
}
