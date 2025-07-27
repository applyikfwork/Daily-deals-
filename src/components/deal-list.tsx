import type { Deal } from "@/lib/types";
import DealCard from "@/components/deal-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Frown } from "lucide-react";

type DealListProps = {
  deals: Deal[];
};

export default function DealList({ deals }: DealListProps) {
  if (deals.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground bg-secondary rounded-2xl">
        <Frown className="mx-auto h-16 w-16 mb-4" />
        <h3 className="text-2xl font-semibold text-foreground">No Deals Found</h3>
        <p className="mt-2">Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
}

DealList.Skeleton = function DealListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
         <div key={i} className="bg-card rounded-lg border overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
        </div>
      ))}
    </div>
  );
}
