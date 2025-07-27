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
        getCategories()
    ]);
    
    let deals = dealsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
        expireAt: (doc.data().expireAt as Timestamp).toDate().toISOString(),
    } as Deal));
    
    if (dealsSnapshot.empty && categories.length > 0) {
        const demoDeals = [
            {
                title: "Demo: Smart Home Hub",
                description: "A central hub to connect and control all your smart home devices. Supports voice commands and is compatible with major brands.",
                price: 4999,
                originalPrice: 7999,
                imageUrl: "https://res.cloudinary.com/dodzjp0gr/image/upload/v1722357879/smart-home-hub_e5wsle.jpg",
                link: "https://example.com/deal/smart-hub",
                category: "Electronics",
                expireAt: addDays(new Date(), 7).toISOString(),
                isHotDeal: true,
            },
            {
                title: "Demo: Wireless Bluetooth Earbuds",
                description: "High-fidelity sound with noise cancellation. Up to 24 hours of battery life with the charging case. Perfect for workouts and calls.",
                price: 2499,
                originalPrice: 4999,
                imageUrl: "https://res.cloudinary.com/dodzjp0gr/image/upload/v1722357878/earbuds_xwef1n.jpg",
                link: "https://example.com/deal/earbuds",
                category: "Mobile",
                expireAt: addDays(new Date(), 10).toISOString(),
                isHotDeal: false,
            },
            {
                title: "Demo: Classic Leather Watch",
                description: "A timeless analog watch with a genuine leather strap and stainless steel case. Water-resistant up to 50m.",
                price: 7999,
                originalPrice: 12999,
                imageUrl: "https://res.cloudinary.com/dodzjp0gr/image/upload/v1722357879/watch_x5diqq.jpg",
                link: "https://example.com/deal/watch",
                category: "Fashion",
                expireAt: addDays(new Date(), 5).toISOString(),
                isHotDeal: false,
            }
        ];
        
        const newDeals: Deal[] = [];
        for (const deal of demoDeals) {
            const newDeal = await addDealToDb(deal);
            newDeals.push(newDeal);
        }
        deals.push(...newDeals);
    }

    return { deals, categories };
}

async function seedInitialCategories() {
  const categoriesQuery = query(categoriesCollection);
  const snapshot = await getDocs(categoriesQuery);
  if (snapshot.empty) {
    console.log('Seeding initial categories...');
    const initialCategories = ["Mobile", "Electronics", "TV", "Fashion", "Appliances", "Books"];
    const batch = writeBatch(db);
    initialCategories.forEach(cat => {
      const docRef = doc(categoriesCollection);
      batch.set(docRef, { name: cat });
    });
    await batch.commit();
    return initialCategories.sort();
  }
  return [];
}


export async function getCategories(): Promise<string[]> {
  await seedInitialCategories(); // Ensure seeding is attempted
  const categoriesQuery = query(categoriesCollection, orderBy('name'));
  const querySnapshot = await getDocs(categoriesQuery);
  const categories = querySnapshot.docs.map(doc => doc.data().name as string);
  // Use a Set to ensure uniqueness, which also prevents the duplicate key error
  return Array.from(new Set(categories));
}

export async function addCategoryToDb(categoryName: string): Promise<string> {
    const trimmedName = categoryName.trim();
    const normalizedName = trimmedName.toLowerCase();

    return await runTransaction(db, async (transaction) => {
        const categoriesRef = collection(db, 'categories');
        const q = query(categoriesRef, where("name", ">=", ""));
        
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
