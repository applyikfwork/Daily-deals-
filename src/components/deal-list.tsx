import type { Deal } from "@/lib/types";
import DealCard from "@/components/deal-card";
import { Skeleton } from "@/components/ui/skeleton";

type DealListProps = {
  deals: Deal[];
};

export default function DealList({ deals }: DealListProps) {
  if (deals.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <h3 className="text-2xl font-semibold">No Deals Found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
}

DealList.Skeleton = function DealListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-card shadow-md rounded-xl p-4 space-y-3">
          <Skeleton className="w-full h-40 rounded-md" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}
