import { Suspense } from 'react';
import ProtectedAdminPage from './protected-admin-page';

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProtectedAdminPage />
    </Suspense>
  );
}
