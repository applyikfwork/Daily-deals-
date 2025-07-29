import type { Deal } from '@/lib/types';
import DealList from './deal-list';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';

type GroupedDealListProps = {
  deals: Deal[];
};

export default function GroupedDealList({ deals }: GroupedDealListProps) {
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
    <div className="space-y-12">
      {sortedDates.map(date => (
        <section key={date}>
          <div className="relative mb-8">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-border"></div>
            <div className="relative flex justify-center">
              <h2 className="bg-background px-4 text-lg font-semibold text-muted-foreground flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                {format(new Date(date), "EEEE, MMMM do, yyyy")}
              </h2>
            </div>
          </div>
          <DealList deals={groupedDeals[date]} />
        </section>
      ))}
    </div>
  );
}
