
import { db } from '@/lib/firebase';
import type { Deal, FooterSettings } from '@/lib/types';
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
  writeBatch,
  runTransaction,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { subDays, startOfToday, startOfDay } from 'date-fns';

const dealsCollection = collection(db, 'deals');
const categoriesCollection = collection(db, 'categories');
const settingsCollection = collection(db, 'settings');

async function seedInitialData() {
    try {
        const categoriesSnapshot = await getDocs(query(categoriesCollection, where('name', '==', 'Electronics')));
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

        const dealsSnapshot = await getDocs(query(dealsCollection));
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
                    expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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
                    expireAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
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
                    expireAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    isHotDeal: false,
                }
            ];
            
            for (const deal of demoDeals) {
                await addDealToDb(deal);
            }
        }
        
        const footerSettingsDoc = doc(settingsCollection, 'footer');
        const footerSnapshot = await getDoc(footerSettingsDoc);
        if (!footerSnapshot.exists()) {
            console.log('Seeding initial footer settings...');
            await setDoc(footerSettingsDoc, {
                privacyPolicyUrl: "#",
                termsOfServiceUrl: "#",
                twitterUrl: "#",
                githubUrl: "#",
                linkedinUrl: "#",
                youtubeUrl: "#",
            });
        }
    } catch (e) {
        console.warn("Could not seed initial data. This might be due to Firestore security rules.", e);
        // This is not a critical error for the app's functionality, so we don't re-throw.
    }
}


export async function getDeals(filters: { query?: string, category?: string, timeScope?: 'today' | 'history' | 'all' } = {}): Promise<Deal[]> {
  const now = new Date();
  const todayStart = startOfToday();
  const fifteenDaysAgo = startOfDay(subDays(now, 15));

  let q = query(dealsCollection, orderBy('createdAt', 'desc'));

  if (filters.category && filters.category !== 'all') {
    q = query(q, where('category', '==', filters.category));
  }
  
  const querySnapshot = await getDocs(q);

  let allDeals: Deal[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
    expireAt: (doc.data().expireAt as Timestamp).toDate().toISOString(),
  } as Deal));

  let deals = allDeals.filter(deal => new Date(deal.createdAt) >= fifteenDaysAgo);

  if (filters.timeScope === 'today') {
      deals = deals.filter(deal => new Date(deal.createdAt) >= todayStart);
  } else if (filters.timeScope === 'history') {
      deals = deals.filter(deal => new Date(deal.createdAt) < todayStart);
  }

  if (filters.query) {
    const lowercasedQuery = filters.query.toLowerCase();
    deals = deals.filter(deal =>
      deal.title.toLowerCase().includes(lowercasedQuery) ||
      deal.description.toLowerCase().includes(lowercasedQuery)
    );
  }

  return deals;
}

export async function getAdminPageData(): Promise<{ deals: Deal[], categories: string[], footerSettings: FooterSettings }> {
    await seedInitialData();

    const dealsQuery = query(dealsCollection, orderBy('createdAt', 'desc'));
    
    const [dealsSnapshot, categories, footerSettings] = await Promise.all([
        getDocs(dealsQuery),
        getCategories(),
        getFooterSettings()
    ]);
    
    let deals = dealsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
        expireAt: (doc.data().expireAt as Timestamp).toDate().toISOString(),
    } as Deal));

    return { deals, categories: Array.from(new Set(categories)), footerSettings };
}

export async function getCategories(): Promise<string[]> {
  const categoriesQuery = query(categoriesCollection, orderBy('name'));
  const querySnapshot = await getDocs(categoriesQuery);
  const categories = querySnapshot.docs.map(doc => doc.data().name as string);
  return Array.from(new Set(categories));
}

export async function addCategoryToDb(categoryName: string): Promise<string> {
    const trimmedName = categoryName.trim();
    if (!trimmedName) throw new Error("Category name cannot be empty.");
    
    const normalizedName = trimmedName.toLowerCase();

    return await runTransaction(db, async (transaction) => {
        const categoriesRef = collection(db, 'categories');
        const q = query(categoriesRef, where('name', '==', trimmedName));
        
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

export async function getFooterSettings(): Promise<FooterSettings> {
    const footerSettingsDoc = doc(settingsCollection, 'footer');
    const defaultSettings = {
        privacyPolicyUrl: "#",
        termsOfServiceUrl: "#",
        twitterUrl: "#",
        githubUrl: "#",
        linkedinUrl: "#",
        youtubeUrl: "#",
    };

    try {
        const footerSnapshot = await getDoc(footerSettingsDoc);
        if (!footerSnapshot.exists()) {
            return defaultSettings;
        }
        return footerSnapshot.data() as FooterSettings;
    } catch(e) {
        console.error("Failed to fetch footer settings, likely due to Firestore permissions. Using default values.", e);
        return defaultSettings;
    }
}

export async function updateFooterSettingsInDb(settings: FooterSettings): Promise<void> {
    const footerSettingsDoc = doc(settingsCollection, 'footer');
    await setDoc(footerSettingsDoc, settings, { merge: true });
}
