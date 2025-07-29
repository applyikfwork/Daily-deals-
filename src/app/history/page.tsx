
import { getDeals, getCategories } from '@/lib/data';
import DealFilters from '@/components/deal-filters';
import { Suspense } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import DealList from '@/components/deal-list';
import GroupedDealList from '@/components/grouped-deal-list';


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

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="relative text-center mb-12">
             <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl -rotate-1"></div>
             <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl py-12 px-6">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Deal History</h1>
                 <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Explore our archive of amazing deals from the last 14 days.
                </p>
             </div>
        </div>

      <DealFilters categories={categories} />

      {deals.length > 0 ? (
         <GroupedDealList deals={deals} />
      ): (
        <div className="text-center py-24">
            <h3 className="text-2xl font-semibold">No Past Deals Found</h3>
            <p className="text-muted-foreground mt-2">There are no deals in the archive for your current search or filter selection.</p>
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
           <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col items-center text-center mb-12">
                 <div className="h-16 bg-muted rounded-2xl w-full max-w-2xl mb-2 animate-pulse"></div>
                 <div className="h-6 bg-muted rounded-md w-2/3 max-w-lg animate-pulse"></div>
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
