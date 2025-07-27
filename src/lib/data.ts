
import type { Deal } from '@/lib/types';
import { subDays, addDays } from 'date-fns';

// In-memory store for deals to simulate a database.
// In a real app, you would replace this with a database client like Firestore or Prisma.
let deals: Deal[] = [
  {
    id: '1',
    title: 'OnePlus Nord CE 3 5G (Aqua Surge, 8GB RAM, 128GB Storage)',
    description: 'A powerful mid-range smartphone with a stunning display and fast charging.',
    price: 19999,
    originalPrice: 24999,
    imageUrl: 'https://placehold.co/600x400.png',
    link: '#',
    category: 'Mobile',
    createdAt: subDays(new Date(), 1).toISOString(),
    expireAt: addDays(new Date(), 5).toISOString(),
    isHotDeal: true,
  },
  {
    id: '2',
    title: 'Sony WH-1000XM4 Wireless Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation with premium sound quality. Perfect for travel and work.',
    price: 22990,
    originalPrice: 29990,
    imageUrl: 'https://placehold.co/600x400.png',
    link: '#',
    category: 'Electronics',
    createdAt: subDays(new Date(), 3).toISOString(),
    expireAt: addDays(new Date(), 10).toISOString(),
    isHotDeal: false,
  },
  {
    id: '3',
    title: 'Samsung 43" Crystal 4K Neo Series Ultra HD Smart LED TV',
    description: 'Experience crystal clear colors and a slim design with this 4K Smart TV.',
    price: 30990,
    originalPrice: 47900,
    imageUrl: 'https://placehold.co/600x400.png',
    link: '#',
    category: 'TV',
    createdAt: subDays(new Date(), 10).toISOString(),
    expireAt: addDays(new Date(), 2).toISOString(),
    isHotDeal: false,
  },
  {
    id: '4',
    title: 'American Tourister 32L Black Backpack',
    description: 'A durable and spacious backpack for daily use and short trips.',
    price: 999,
    originalPrice: 2300,
    imageUrl: 'https://placehold.co/600x400.png',
    link: '#',
    category: 'Fashion',
    createdAt: subDays(new Date(), 5).toISOString(),
    expireAt: addDays(new Date(), 1).toISOString(),
    isHotDeal: false,
  },
  {
    id: '5',
    title: 'LG 1.5 Ton 5 Star AI DUAL Inverter Split AC',
    description: 'Energy-efficient AC with AI-powered cooling for ultimate comfort.',
    price: 46490,
    originalPrice: 78990,
    imageUrl: 'https://placehold.co/600x400.png',
    link: '#',
    category: 'Appliances',
    createdAt: subDays(new Date(), 14).toISOString(),
    expireAt: addDays(new Date(), 7).toISOString(),
    isHotDeal: false,
  },
  {
    id: '6',
    title: 'Atomic Habits by James Clear',
    description: 'An easy & proven way to build good habits & break bad ones.',
    price: 450,
    originalPrice: 799,
    imageUrl: 'https://placehold.co/600x400.png',
    link: '#',
    category: 'Books',
    createdAt: subDays(new Date(), 2).toISOString(),
    expireAt: addDays(new Date(), 20).toISOString(),
    isHotDeal: false,
  },
];

let categories = Array.from(new Set(deals.map(d => d.category)));

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// NOTE: The following functions mimic database operations.
// Auto-delete logic (older than 15 days) is simulated in getDeals.

export async function getDeals(filters: { query?: string, category?: string } = {}): Promise<Deal[]> {
  await delay(200);

  const now = new Date();
  const cutoff = subDays(now, 15);

  let filteredDeals = deals
    .filter(deal => new Date(deal.createdAt) >= cutoff) // Filter deals within the last 15 days
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (filters.query) {
    const lowercasedQuery = filters.query.toLowerCase();
    filteredDeals = filteredDeals.filter(deal =>
      deal.title.toLowerCase().includes(lowercasedQuery) ||
      deal.description.toLowerCase().includes(lowercasedQuery)
    );
  }

  if (filters.category && filters.category !== 'all') {
    filteredDeals = filteredDeals.filter(deal => deal.category === filters.category);
  }
  
  return filteredDeals;
}

export async function getAllDealsForAdmin(): Promise<Deal[]> {
  await delay(100);
  return [...deals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getCategories(): Promise<string[]> {
  await delay(100);
  return [...categories].sort();
}

export async function addCategoryToDb(categoryName: string): Promise<string> {
  await delay(300);
  const trimmedName = categoryName.trim();
  if (categories.find(c => c.toLowerCase() === trimmedName.toLowerCase())) {
    throw new Error(`Category "${trimmedName}" already exists.`);
  }
  categories.push(trimmedName);
  return trimmedName;
}

export async function addDealToDb(dealData: Omit<Deal, 'id' | 'createdAt'>): Promise<Deal> {
  await delay(500);
  const newDeal: Deal = {
    ...dealData,
    id: (deals.length + 1).toString(),
    createdAt: new Date().toISOString(),
  };
  deals.unshift(newDeal); // Add to the beginning of the array
  if (!categories.includes(newDeal.category)) {
      categories.push(newDeal.category);
  }
  return newDeal;
}

export async function deleteDealFromDb(id: string): Promise<{ success: boolean }> {
  await delay(500);
  const initialLength = deals.length;
  deals = deals.filter(deal => deal.id !== id);
  if (deals.length < initialLength) {
    return { success: true };
  }
  throw new Error('Deal not found');
}
