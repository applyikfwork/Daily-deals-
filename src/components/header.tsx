'use client';

import Link from 'next/link';
import { Package2, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Package2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Deal Finder</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin">
                <UserCog className="h-5 w-5" />
                <span className="sr-only">Admin Panel</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
