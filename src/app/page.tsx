
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

async function DealsSection({ query, category }: { query: string; category: string }) {
  let deals: Deal[] = [];
  let categories: string[] = [];
  let error: string | null = null;

  try {
    const [fetchedDeals, fetchedCategories] = await Promise.all([
      getDeals({ query, category }),
      getCategories(),
    ]);
    deals = fetchedDeals;
    categories = fetchedCategories;
  } catch (e: any) {
    console.error("Failed to fetch data, likely due to Firestore permissions.", e);
    error = e.message || "An unexpected error occurred.";
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Fetching Deals</AlertTitle>
        <AlertDescription>
          There was a problem fetching data from the database. This is likely due to Firestore security rules. Please ensure your rules allow public read access.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold mb-6 text-center text-foreground/90">
        🕒 Last 15 Days Deals
      </h2>
      
      <DealFilters categories={categories} />
      <DealList deals={deals} />
    </section>
  );
}


export default async function Home({ searchParams }: HomeProps) {
  const query = searchParams?.query || '';
  const category = searchParams?.category || 'all';

  // Fetch top deal separately to avoid delaying the whole page
  const topDeals = await getDeals({ category: 'all' });
  
  const hotDeal = topDeals.length > 0 
    ? topDeals.find(deal => deal.isHotDeal) || topDeals[0]
    : null;


  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading banner...</div>}>
        {hotDeal && <TopDealBanner deal={hotDeal} />}
      </Suspense>

      <Suspense fallback={
          <section className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-center text-foreground/90">
              🕒 Last 15 Days Deals
            </h2>
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="h-10 bg-muted rounded-md w-full"></div>
              <div className="h-10 bg-muted rounded-md w-full sm:w-[200px]"></div>
            </div>
            <DealList.Skeleton />
          </section>
      }>
        <DealsSection query={query} category={category} />
      </Suspense>
    </div>
  );
}
