'use client';

import { getAllDealsForAdmin, getCategories } from '@/lib/data';
import { DealsTable } from '@/components/admin/deals-table';
import { AddDealDialog } from '@/components/admin/add-deal-dialog';
import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { type Deal } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';

const ADMIN_EMAIL = 'xyzadminserviceacc@gmail.com';

export default function ProtectedAdminPage() {
  const { user, loading } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const isAuthorized = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    async function loadAdminData() {
      if (isAuthorized) {
        try {
          const [dealsData, categoriesData] = await Promise.all([
            getAllDealsForAdmin(),
            getCategories(),
          ]);
          setDeals(dealsData);
          setCategories(categoriesData);
        } catch (error) {
          console.error("Failed to load admin data", error);
        } finally {
          setDataLoading(false);
        }
      } else {
        setDataLoading(false);
      }
    }

    if (!loading) {
      loadAdminData();
    }
  }, [user, loading, isAuthorized]);

  if (loading || dataLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Loading Admin Panel...</h1>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center h-[60vh]">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground mt-2">
          You are not authorized to view this page. Please sign in with an admin account.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <AddDealDialog categories={categories} />
      </div>
      <p className="mb-6 text-muted-foreground">
        Welcome, {user.email}. Manage your deals here. Add, edit, or delete deals as needed.
      </p>

      <Suspense fallback={<DealsTable.Skeleton />}>
        <DealsTable data={deals} />
      </Suspense>
    </div>
  );
}
