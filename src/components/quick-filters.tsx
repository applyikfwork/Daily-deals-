
'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Flame, Zap, BadgePercent, Cpu } from 'lucide-react';

const quickFilters = [
  { label: 'Hot Deals', value: 'hot', icon: Flame },
  { label: 'Ends Soon', value: 'soon', icon: Zap },
  { label: 'Under ₹499', value: 'under499', icon: BadgePercent },
  { label: 'Top Tech', value: 'tech', icon: Cpu },
];

export default function QuickFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const activeFilter = searchParams.get('filter');

  const handleFilterClick = (value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (activeFilter === value) {
      // If clicking the active filter again, remove it
      params.delete('filter');
    } else {
      params.set('filter', value);
    }
    // Remove category when a quick filter is applied to avoid conflicts
    params.delete('category');
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-8 flex items-center justify-center flex-wrap gap-3">
      {quickFilters.map(({ label, value, icon: Icon }) => (
        <Button
          key={value}
          variant={activeFilter === value ? 'default' : 'outline'}
          className={cn(
            "rounded-full transition-all duration-300 transform hover:scale-105",
            activeFilter === value && "shadow-lg"
          )}
          onClick={() => handleFilterClick(value)}
        >
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}
