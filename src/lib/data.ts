
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
import { subDays, startOfToday, startOfDay, addHours, addDays } from 'date-fns';

const dealsCollection = collection(db, 'deals');
const categoriesCollection = collection(db, 'categories');
const settingsCollection = collection(db, 'settings');

async function seedInitialData() {
    try {
        const categoriesSnapshot = await getDocs(query(categoriesCollection, where('name', '==', 'Electronics')));
        if (categoriesSnapshot.empty) {
            console.log('Seeding initial categories...');
            const initialCategories = ["Mobile", "Electronics", "TV", "Fashion", "Appliances", "Books", "Home"];
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
                // Hot Deals
                {
                    title: "Smart Home Hub Pro",
                    description: "A central hub to connect and control all your smart home devices. Supports voice commands and is compatible with major brands.",
                    price: 4999,
                    originalPrice: 7999,
                    imageUrl: "https://res.cloudinary.com/dodzjp0gr/image/upload/v1722357879/smart-home-hub_e5wsle.jpg",
                    link: "https://example.com/deal/smart-hub-pro",
                    category: "Electronics",
                    expireAt: addDays(new Date(), 7).toISOString(),
                    isHotDeal: true,
                },
                {
                    title: "Premium Mechanical Keyboard",
                    description: "RGB backlit mechanical keyboard with customizable keys and a durable aluminum frame. Perfect for gaming and typing.",
                    price: 6999,
                    originalPrice: 9999,
                    imageUrl: "https://res.cloudinary.com/dodzjp0gr/image/upload/v1722449767/keyboard_jw9ycn.jpg",
                    link: "https://example.com/deal/mechanical-keyboard",
                    category: "Electronics",
                    expireAt: addDays(new Date(), 10).toISOString(),
                    isHotDeal: true,
                },
                // Ends Soon Deals (expire in < 2 days)
                {
                    title: "Last Minute: Bluetooth Speaker",
                    description: "Portable Bluetooth speaker with 12-hour battery life. Offer ends soon!",
                    price: 1899,
                    originalPrice: 3499,
                    imageUrl: "https://res.cloudinary.com/dodzjp0gr/image/upload/v1722449767/speaker_q89hba.jpg",
                    link: "https://example.com/deal/bt-speaker-ends-soon",
                    category: "Electronics",
                    expireAt: addHours(new Date(), 36).toISOString(), // Expires in 1.5 days
                    isHotDeal: false,
                },
                {
                    title: "Flash Sale: Digital Photo Frame",
                    description: "Display your favorite memories on this 10-inch Wi-Fi digital photo frame. Sale ending very soon.",
                    price: 3999,
                    originalPrice: 6999,
                    imageUrl: "https://res.cloudinary.com/dodzjp0gr/image/upload/v1722449767/photo-frame_yrmkda.jpg",
                    link: "https://example.com/deal/digital-frame-flash-sale",
                    category: "Home",
                    expireAt: addHours(new Date(), 24).toISOString(), // Expires in 1 day
                    isHotDeal: false,
                },
                 // Under ₹499 Deals
                {
                    title: "USB-C Fast Charging Cable",
                    description: "Durable 6ft braided USB-C to USB-C cable for fast charging and data transfer.",
                    price: 399,
                    originalPrice: 999,
                    imageUrl: "https://res.cloudinary.com/dodzjp0gr/image/upload/v1722449767/cable_v4vszl.jpg",
                    link: "https://example.com/deal/usbc-cable-399",
                    category: "Mobile",
                    expireAt: addDays(new Date(), 20).toISOString(),
                    isHotDeal: false,
                },
                {
                    title: "Compact Travel Umbrella",
                    description: "Lightweight and windproof travel umbrella. A must-have for daily commutes.",
                    price: 450,
                    originalPrice: 1200,
                    imageUrl: "https://res.cloudinary.com/dodzjp0gr/image/upload/v1722449768/umbrella_kqcjwr.jpg",
                    link: "https://example.com/deal/umbrella-450",
                    category: "Fashion",
                    expireAt: addDays(new Date(), 30).toISOString(),
                    isHotDeal: false,
                },
                // Top Tech Deals
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
                    title: "Gaming Mouse with RGB",
                    description: "High-precision gaming mouse with customizable RGB lighting and programmable buttons.",
                    price: 1599,
                    originalPrice: 2999,
                    imageUrl: "https://res.cloudinary.com/dodzjp0gr/image/upload/v1722449767/mouse_s6gxxq.jpg",
                    link: "https://example.com/deal/gaming-mouse",
                    category: "Electronics",
                    expireAt: addDays(new Date(), 12).toISOString(),
                    isHotDeal: false,
                },
                // Additional Demo from User Request
                {
                    title: "Demo Product",
                    description: "This is a demo product added based on user request.",
                    price: 1000,
                    originalPrice: 3000,
                    imageUrl: "https://placehold.co/400x250.png",
                    link: "https://example.com/deal/demo-product",
                    category: "Electronics",
                    expireAt: addDays(new Date(), 3).toISOString(),
                    isHotDeal: true,
                },
                // Original Deals
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
        
        const footerSettingsDoc = doc(settingsCollection, 'footer');
        const footerSnapshot = await getDoc(footerSettingsDoc);
        if (!footerSnapshot.exists()) {
            console.log('Seeding initial footer settings...');
            await setDoc(footerSettingsDoc, {
                privacyPolicyUrl: "/privacy",
                termsOfServiceUrl: "/terms",
                affiliateDisclaimerUrl: "/disclaimer",
                twitterUrl: "#",
                linkedinUrl: "#",
                youtubeUrl: "#",
            });
        }
    } catch (e) {
        console.warn("Could not seed initial data. This might be due to Firestore security rules.", e);
        // This is not a critical error for the app's functionality, so we don't re-throw.
    }
}

// Call seedInitialData to ensure data exists on first run
seedInitialData();


export async function getDeals(filters: { query?: string, category?: string, timeScope?: 'today' | 'history' | 'all', filter?: 'hot' | 'soon' | 'under499' | 'tech' } = {}): Promise<Deal[]> {
  try {
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
  
    // Filter by date range first (within last 15 days)
    let dealsInDateRange = allDeals.filter(deal => new Date(deal.createdAt) >= fifteenDaysAgo);
  
    let deals: Deal[];
    // Apply time scope filtering
    if (filters.timeScope === 'today') {
        deals = dealsInDateRange.filter(deal => new Date(deal.createdAt) >= todayStart);
    } else if (filters.timeScope === 'history') {
        deals = dealsInDateRange.filter(deal => new Date(deal.createdAt) < todayStart);
    } else { // 'all' or undefined
        deals = dealsInDateRange;
    }
    
     // Apply category filter if not a special filter that defines its own categories
    if (filters.category && filters.category !== 'all' && filters.filter !== 'tech') {
       deals = deals.filter(deal => deal.category === filters.category);
    }

    // Apply special filters
    if (filters.filter) {
        switch (filters.filter) {
            case 'hot':
                deals = deals.filter(deal => deal.isHotDeal);
                break;
            case 'soon':
                const fortyEightHoursFromNow = addHours(now, 48);
                deals = deals.filter(deal => {
                    const expiryDate = new Date(deal.expireAt);
                    // Only show deals that are not expired and end soon
                    return expiryDate > now && expiryDate <= fortyEightHoursFromNow;
                });
                break;
            case 'under499':
                deals = deals.filter(deal => deal.price < 499);
                break;
            case 'tech':
                deals = deals.filter(deal => ['Electronics', 'Mobile'].includes(deal.category));
                break;
        }
    }
    
    // Apply search query filtering
    if (filters.query) {
      const lowercasedQuery = filters.query.toLowerCase();
      deals = deals.filter(deal =>
        deal.title.toLowerCase().includes(lowercasedQuery) ||
        deal.description.toLowerCase().includes(lowercasedQuery)
      );
    }

    return deals;

  } catch (e: any) {
    console.error("Failed to fetch deals, likely due to Firestore permissions. Returning empty array.", e);
    // Return empty array on error to prevent crashes on the page.
    return [];
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const categoriesQuery = query(categoriesCollection, orderBy('name'));
    const querySnapshot = await getDocs(categoriesQuery);
    const categories = querySnapshot.docs.map(doc => doc.data().name as string);
    return Array.from(new Set(categories));
  } catch(e) {
     console.error("Failed to fetch categories, likely due to Firestore permissions. Returning empty array.", e);
     return [];
  }
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
    const defaultSettings: FooterSettings = {
        privacyPolicyUrl: "/privacy",
        termsOfServiceUrl: "/terms",
        affiliateDisclaimerUrl: "/disclaimer",
        twitterUrl: "#",
        linkedinUrl: "#",
        youtubeUrl: "#",
    };

    try {
        const footerSettingsDoc = doc(settingsCollection, 'footer');
        const footerSnapshot = await getDoc(footerSettingsDoc);
        
        if (!footerSnapshot.exists()) {
            console.log("Footer settings not found, returning default. This may be due to Firestore rules.");
            return defaultSettings;
        }
        
        const dbData = footerSnapshot.data() || {};
        
        // Merge database data with defaults to ensure all properties exist
        return {
            ...defaultSettings,
            ...dbData,
        };
    } catch(e) {
        console.error("Failed to fetch footer settings, likely due to Firestore permissions. Using default values.", e);
        return defaultSettings;
    }
}

export async function updateFooterSettingsInDb(settings: Partial<FooterSettings>): Promise<void> {
    const footerSettingsDoc = doc(settingsCollection, 'footer');
    await setDoc(footerSettingsDoc, settings, { merge: true });
}
