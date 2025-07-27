
import { getDeals, getCategories } from '@/lib/data';
import DealFilters from '@/components/deal-filters';
import DealList from '@/components/deal-list';
import { Suspense } from 'react';
import type { Deal } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

type HistoryPageProps = {
  searchParams: {
    query?: string;
    category?: string;
  };
};

async function DealsHistorySection({ query, category }: { query: string; category: string }) {
  const deals = await getDeals({ query, category, timeScope: 'history' });
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
  
  // Group deals by date
  const groupedDeals = deals.reduce((acc, deal) => {
    const date = format(new Date(deal.createdAt), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(deal);
    return acc;
  }, {} as Record<string, Deal[]>);

  const sortedDates = Object.keys(groupedDeals).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());


  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center mb-8">
             <h1 className="text-4xl font-bold tracking-tight">Deal History</h1>
             <p className="mt-2 text-lg text-muted-foreground">
                Browse deals from the last 14 days.
            </p>
        </div>

      <DealFilters categories={categories} />

      {deals.length > 0 ? (
         <div className="space-y-12">
            {sortedDates.map(date => (
                <section key={date}>
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
                        {format(new Date(date), "EEEE, MMMM do, yyyy")}
                    </h2>
                    <DealList deals={groupedDeals[date]} />
                </section>
            ))}
         </div>
      ): (
        <div className="text-center py-16 text-muted-foreground">
            <h3 className="text-2xl font-semibold">No Past Deals Found</h3>
            <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}


export default function HistoryPage({ searchParams }: HistoryPageProps) {
  const query = searchParams?.query || '';
  const category = searchParams?.category || 'all';

  return (
      <Suspense fallback={
           <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center text-center mb-8">
                 <div className="h-10 bg-muted rounded-md w-1/2 mb-2 animate-pulse"></div>
                 <div className="h-6 bg-muted rounded-md w-2/3 animate-pulse"></div>
            </div>
             <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="h-10 bg-muted rounded-md w-full animate-pulse"></div>
              <div className="h-10 bg-muted rounded-md w-full sm:w-[200px] animate-pulse"></div>
            </div>
             <div className="h-8 bg-muted rounded-md w-1/3 mb-6 animate-pulse"></div>
            <DealList.Skeleton />
          </div>
      }>
        <DealsHistorySection query={query} category={category} />
      </Suspense>
  );
}
