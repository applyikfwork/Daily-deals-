
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
  runTransaction,
} from 'firebase/firestore';
import { subDays, addDays } from 'date-fns';

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


export async function getAdminPageData(): Promise<{ deals: Deal[], categories: string[] }> {
    const dealsQuery = query(dealsCollection, orderBy('createdAt', 'desc'));
    
    const [dealsSnapshot, categories] = await Promise.all([
        getDocs(dealsQuery),
        getCategories() // Use getCategories to handle seeding logic
    ]);
    
    let deals = dealsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
        expireAt: (doc.data().expireAt as Timestamp).toDate().toISOString(),
    } as Deal));
    
    // Seed one deal if none exist
    if (dealsSnapshot.empty) {
        const demoDeal = {
            title: "Demo Product: Smart Home Hub",
            description: "A central hub to connect and control all your smart home devices. Supports voice commands and is compatible with major brands.",
            price: 4999,
            originalPrice: 7999,
            imageUrl: "https://placehold.co/600x400.png",
            link: "https://example.com/deal/smart-hub",
            category: "Electronics",
            expireAt: addDays(new Date(), 7).toISOString(),
            isHotDeal: true,
        };
        const newDeal = await addDealToDb(demoDeal);
        deals.push(newDeal);
    }

    return { deals, categories };
}

export async function getCategories(): Promise<string[]> {
  const categoriesQuery = query(categoriesCollection, orderBy('name'));
  const querySnapshot = await getDocs(categoriesQuery);
  
  if (querySnapshot.empty) {
    const initialCategories = ["Mobile", "Electronics", "TV", "Fashion", "Appliances", "Books"];
    const batch = writeBatch(db);
    initialCategories.forEach(cat => {
      const docRef = doc(categoriesCollection); // Generate new doc with unique ID
      batch.set(docRef, { name: cat });
    });
    await batch.commit();
    return initialCategories.sort();
  }
  
  const categories = querySnapshot.docs.map(doc => doc.data().name as string);
  return Array.from(new Set(categories)); // Deduplicate
}

export async function addCategoryToDb(categoryName: string): Promise<string> {
    const trimmedName = categoryName.trim();
    const normalizedName = trimmedName.toLowerCase();

    return await runTransaction(db, async (transaction) => {
        const categoriesRef = collection(db, 'categories');
        const q = query(categoriesRef, where("name", ">=", "")); // A trick to query all for case-insensitive check
        
        const snapshot = await getDocs(q);

        const existingCategory = snapshot.docs.find(doc => doc.data().name.toLowerCase() === normalizedName);

        if (existingCategory) {
            throw new Error(`Category "${trimmedName}" already exists.`);
        }

        const newCategoryRef = doc(categoriesRef);
        transaction.set(newCategoryRef, { name: trimmedName });

        return trimmedName;
    });
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
