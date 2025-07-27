import { getAllDealsForAdmin, getCategories } from '@/lib/data';
import { DealsTable } from '@/components/admin/deals-table';
import { AddDealDialog } from '@/components/admin/add-deal-dialog';
import { Suspense } from 'react';

export default async function AdminPage() {
  const deals = await getAllDealsForAdmin();
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <AddDealDialog categories={categories} />
      </div>
      <p className="mb-6 text-muted-foreground">
        Manage your deals here. Add, edit, or delete deals as needed.
      </p>

      <Suspense fallback={<DealsTable.Skeleton />}>
        <DealsTable data={deals} />
      </Suspense>
    </div>
  );
}
