
import { getDeals, getCategories } from '@/lib/data';
import TopDealBanner from '@/components/top-deal-banner';
import DealFilters from '@/components/deal-filters';
import DealList from '@/components/deal-list';
import { Suspense } from 'react';

type HomeProps = {
  searchParams?: {
    query?: string;
    category?: string;
  };
};

export default async function Home({ searchParams }: HomeProps) {
  const query = searchParams?.query || '';
  const category = searchParams?.category || 'all';

  const deals = await getDeals({ query, category });
  const categories = await getCategories();
  
  const hotDeal = deals.length > 0 
    ? deals.find(deal => deal.isHotDeal) || deals[0]
    : null;

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
