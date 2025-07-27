
import { getDeals, getCategories } from '@/lib/data';
import TopDealBanner from '@/components/top-deal-banner';
import DealFilters from '@/components/deal-filters';
import DealList from '@/components/deal-list';
import { Suspense } from 'react';
import type { Deal } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

type HomeProps = {
  searchParams?: {
    query?: string;
    category?: string;
  };
};

export default async function Home({ searchParams }: HomeProps) {
  const query = searchParams?.query || '';
  const category = searchParams?.category || 'all';

  let deals: Deal[] = [];
  let categories: string[] = [];
  let error: string | null = null;

  try {
    // These need to be fetched in parallel to avoid deadlocks in some cases
    const [fetchedDeals, fetchedCategories] = await Promise.all([
      getDeals({ query, category }),
      getCategories()
    ]);
    deals = fetchedDeals;
    categories = fetchedCategories;
  } catch (e: any) {
    console.error("Failed to fetch data, likely due to Firestore permissions.", e);
    error = e.message || "An unexpected error occurred.";
  }
  
  const hotDeal = deals.length > 0 
    ? deals.find(deal => deal.isHotDeal) || deals[0]
    : null;

  if (error) {
    return (
       <div className="container mx-auto px-4 py-8">
         <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Fetching Deals</AlertTitle>
          <AlertDescription>
            There was a problem fetching data from the database. This is likely due to Firestore security rules. Please ensure your rules allow public read access.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading banner...</div>}>
        {hotDeal && <TopDealBanner deal={hotDeal} />}
      </Suspense>

      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-foreground/90">
          🕒 Last 15 Days Deals
        </h2>
        
        <Suspense fallback={<div>Loading filters...</div>}>
          <DealFilters categories={categories} />
        </Suspense>

        <Suspense fallback={<DealList.Skeleton />}>
          <DealList deals={deals} />
        </Suspense>
      </section>
    </div>
  );
}
