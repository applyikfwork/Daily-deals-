
'use client';

import { getAdminPageData } from '@/lib/data';
import { DealsTable } from '@/components/admin/deals-table';
import { AddDealDialog } from '@/components/admin/add-deal-dialog';
import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { type Deal } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';
import { CategoryManager } from '@/components/admin/category-manager';

const ADMIN_EMAIL = 'xyzadminserviceacc@gmail.com';

export default function ProtectedAdminPage() {
  const { user, loading } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) {
      return; // Wait until authentication status is resolved
    }

    const authorized = user?.email === ADMIN_EMAIL;
    setIsAuthorized(authorized);

    async function loadAdminData() {
      if (authorized) {
        try {
          const { deals, categories } = await getAdminPageData();
          setDeals(deals);
          setCategories(categories);
        } catch (error) {
          console.error("Failed to load admin data", error);
        } finally {
          setDataLoading(false);
        }
      } else {
        setDataLoading(false);
      }
    }
    
    loadAdminData();
  }, [user, loading]);

  if (loading || isAuthorized === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Loading Admin Panel...</h1>
        <p>Please wait while we verify your credentials.</p>
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
  
  if (dataLoading) {
     return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Loading data...</h1>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>
      <p className="mb-6 text-muted-foreground">
        Welcome, {user?.email}. Manage your deals and categories here.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-bold">Deals Management</h2>
             <AddDealDialog categories={categories} />
          </div>
          <Suspense fallback={<DealsTable.Skeleton />}>
            <DealsTable data={deals} />
          </Suspense>
        </div>
        <div>
           <h2 className="text-2xl font-bold mb-4">Category Management</h2>
           <CategoryManager initialCategories={categories} />
        </div>
      </div>
    </div>
  );
}
