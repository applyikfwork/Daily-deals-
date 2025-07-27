
import { getDeals, getCategories } from '@/lib/data';
import TopDealBanner from '@/components/top-deal-banner';
import DealFilters from '@/components/deal-filters';
import DealList from '@/components/deal-list';
import { Suspense } from 'react';
import type { Deal } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type HomeProps = {
  searchParams?: {
    query?: string;
    category?: string;
  };
};

async function DealsSection({ query, category }: { query: string; category: string }) {
  const deals = await getDeals({ query, category, timeScope: 'today' });
  const categories = await getCategories();
  
  if (!deals || !categories) {
    return (
       <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Fetching Deals</AlertTitle>
          <AlertDescription>
            There was a problem fetching data from the database. Please check your connection or Firestore security rules.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DealFilters categories={categories} />
      <DealList deals={deals} />
    </div>
  );
}

async function TopDealSection() {
    const topDeals = await getDeals({ category: 'all', timeScope: 'today' });
    
    if (!topDeals) return null;

    const hotDeal = topDeals.find(deal => deal.isHotDeal) || (topDeals.length > 0 ? topDeals[0] : null);
    
    if (!hotDeal) return null;

    return <TopDealBanner deal={hotDeal} />;
}


export default function Home({ searchParams }: HomeProps) {
  const query = searchParams?.query || '';
  const category = searchParams?.category || 'all';

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <Suspense fallback={<Skeleton className="h-[350px] w-full rounded-2xl" />}>
        <TopDealSection />
      </Suspense>

      <section>
        <h2 className="text-3xl font-bold tracking-tighter mb-8 text-center">
            ✨ Today's Hottest Deals
        </h2>
        <Suspense fallback={
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-10 w-full flex-grow" />
                <Skeleton className="h-10 w-full sm:w-[200px]" />
              </div>
              <DealList.Skeleton />
            </div>
        }>
          <DealsSection query={query} category={category} />
        </Suspense>
      </section>
    </div>
  );
}
