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
import { subDays, addDays, startOfToday, endOfToday, startOfDay } from 'date-fns';

const dealsCollection = collection(db, 'deals');
const categoriesCollection = collection(db, 'categories');

// NOTE: The following functions now interact with Firestore.

export async function getDeals(filters: { query?: string, category?: string, timeScope?: 'today' | 'history' } = {}): Promise<Deal[]> {
  const now = new Date();
  const todayStart = startOfToday();
  const fifteenDaysAgo = startOfDay(subDays(now, 15));

  let q = query(dealsCollection, orderBy('createdAt', 'desc'));

  const querySnapshot = await getDocs(q);

  let allDeals: Deal[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
    expireAt: (doc.data().expireAt as Timestamp).toDate().toISOString(),
  } as Deal));

  // Filter by date range first
  let deals = allDeals.filter(deal => {
      const createdAt = new Date(deal.createdAt);
      return createdAt >= fifteenDaysAgo;
  });

  // Filter by time scope (today or history)
  if (filters.timeScope === 'today') {
      deals = deals.filter(deal => new Date(deal.createdAt) >= todayStart);
  } else if (filters.timeScope === 'history') {
      deals = deals.filter(deal => new Date(deal.createdAt) < todayStart);
  }

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    deals = deals.filter(deal => deal.category === filters.category);
  }

  // Filter by search query
  if (filters.query) {
    const lowercasedQuery = filters.query.toLowerCase();
    deals = deals.filter(deal =>
      deal.title.toLowerCase().includes(lowercasedQuery) ||
      deal.description.toLowerCase().includes(lowercasedQuery)
    );
  }

  return deals;
}

async function seedInitialData() {
    const categoriesQuery = query(categoriesCollection);
    const categoriesSnapshot = await getDocs(categoriesQuery);
    if (categoriesSnapshot.empty) {
        console.log('Seeding initial categories...');
        const initialCategories = ["Mobile", "Electronics", "TV", "Fashion", "Appliances", "Books"];
        const batch = writeBatch(db);
        initialCategories.forEach(cat => {
            const docRef = doc(categoriesCollection);
            batch.set(docRef, { name: cat });
        });
        await batch.commit();
    }

    const dealsQuery = query(dealsCollection);
    const dealsSnapshot = await getDocs(dealsQuery);
    if (dealsSnapshot.empty) {
        console.log('Seeding initial deals...');
        const demoDeals = [
            {
                title: "Smart Home Hub",
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
                title: "Wireless Bluetooth Earbuds",
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
                title: "Classic Leather Watch",
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
        
        for (const deal of demoDeals) {
            await addDealToDb(deal);
        }
    }
}


export async function getAdminPageData(): Promise<{ deals: Deal[], categories: string[] }> {
    await seedInitialData();

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

    return { deals, categories: Array.from(new Set(categories)) };
}

export async function getCategories(): Promise<string[]> {
  const categoriesQuery = query(categoriesCollection, orderBy('name'));
  const querySnapshot = await getDocs(categoriesQuery);
  const categories = querySnapshot.docs.map(doc => doc.data().name as string);
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
