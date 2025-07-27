
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
      getDeals({ query, category, timeScope: 'today' }),
      getCategories(),
    ]);
    deals = fetchedDeals;
    categories = Array.from(new Set(fetchedCategories));
  } catch (e: any) {
    console.error("Failed to fetch data, likely due to Firestore permissions.", e);
    error = e.message || "An unexpected error occurred.";
  }
  
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
    );
  }

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold mb-6 text-center text-foreground/90">
        ✨ Today's Hottest Deals
      </h2>
      
      <DealFilters categories={categories} />
      <DealList deals={deals} />
    </section>
  );
}

async function TopDealSection() {
    let topDeals: Deal[] = [];
    try {
        topDeals = await getDeals({ category: 'all', timeScope: 'today' });
    } catch (e: any) {
        console.error("Failed to fetch top deals", e);
        // Do not render an alert here to avoid layout shifts. The main deal section will show a more prominent error.
        return null;
    }

    const hotDeal = topDeals.find(deal => deal.isHotDeal) || (topDeals.length > 0 ? topDeals[0] : null);
    
    if (!hotDeal) return null;

    return <TopDealBanner deal={hotDeal} />;
}


export default function Home({ searchParams }: HomeProps) {
  const query = searchParams?.query || '';
  const category = searchParams?.category || 'all';

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="h-[250px] bg-muted rounded-2xl animate-pulse"></div>}>
        <TopDealSection />
      </Suspense>

      <Suspense fallback={
          <section className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-center text-foreground/90">
              ✨ Today's Hottest Deals
            </h2>
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="h-10 bg-muted rounded-md w-full animate-pulse"></div>
              <div className="h-10 bg-muted rounded-md w-full sm:w-[200px] animate-pulse"></div>
            </div>
            <DealList.Skeleton />
          </section>
      }>
        <DealsSection query={query} category={category} />
      </Suspense>
    </div>
  );
}
