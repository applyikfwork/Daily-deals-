
import { getDeals, getCategories } from '@/lib/data';
import TopDealBanner from '@/components/top-deal-banner';
import DealFilters from '@/components/deal-filters';
import DealList from '@/components/deal-list';
import { Suspense } from 'react';
import type { Deal } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CalendarCheck, History } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import QuickFilters from '@/components/quick-filters';
import { isToday } from 'date-fns';

type HomeProps = {
  searchParams?: {
    query?: string;
    category?: string;
    filter?: 'hot' | 'soon' | 'under499' | 'tech';
  };
};

async function DealsSection({ query, category, filter }: { query: string; category: string; filter?: 'hot' | 'soon' | 'under499' | 'tech' }) {
  const deals = await getDeals({ query, category, timeScope: 'all', filter });
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

  const todayDeals = deals.filter(deal => isToday(new Date(deal.createdAt)));
  const pastDeals = deals.filter(deal => !isToday(new Date(deal.createdAt)));
  const showGroupedView = filter && filter !== 'soon';

  return (
    <div className="space-y-8">
      <DealFilters categories={categories} />
      <QuickFilters />
      
      {showGroupedView ? (
        <div className='space-y-12'>
            {todayDeals.length > 0 && (
                <section>
                    <div className="relative mb-6">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-border"></div>
                        <div className="relative flex justify-center">
                            <h2 className="bg-background px-4 text-lg font-semibold text-muted-foreground flex items-center gap-2">
                                <CalendarCheck className="h-5 w-5" />
                                Today's Deals
                            </h2>
                        </div>
                    </div>
                    <DealList deals={todayDeals} />
                </section>
            )}
            {pastDeals.length > 0 && (
                <section>
                    <div className="relative mb-6">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-border"></div>
                        <div className="relative flex justify-center">
                            <h2 className="bg-background px-4 text-lg font-semibold text-muted-foreground flex items-center gap-2">
                                <History className="h-5 w-5" />
                                Past Deals
                            </h2>
                        </div>
                    </div>
                    <DealList deals={pastDeals} />
                </section>
            )}
            {deals.length === 0 && <DealList deals={[]} />}
        </div>
      ) : (
        <DealList deals={deals} />
      )}
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
  const filter = searchParams?.filter;

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
               <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-28 rounded-full" />
                <Skeleton className="h-9 w-32 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
              </div>
              <DealList.Skeleton />
            </div>
        }>
          <DealsSection query={query} category={category} filter={filter} />
        </Suspense>
      </section>
    </div>
  );
}
