
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { type Deal } from '@/lib/types';
import { deleteDealAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';

interface DealsTableProps {
  data: Deal[];
}

const ALLOWED_HOSTS = ['placehold.co', 'm.media-amazon.com'];

function isValidImageUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    return ALLOWED_HOSTS.includes(parsedUrl.hostname);
  } catch (error) {
    return false;
  }
}

export function DealsTable({ data }: DealsTableProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      startTransition(async () => {
        const result = await deleteDealAction(id);
        if (result.success) {
          toast({
            title: 'Success',
            description: 'Deal deleted successfully.',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to delete deal.',
            variant: 'destructive',
          });
        }
      });
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((deal) => {
            const imageUrl = isValidImageUrl(deal.imageUrl)
              ? deal.imageUrl
              : 'https://placehold.co/50x50.png';
            
            return (
              <TableRow key={deal.id}>
                <TableCell>
                  <Image
                    src={imageUrl}
                    alt={deal.title}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                    data-ai-hint="product photo"
                  />
                </TableCell>
                <TableCell className="font-medium">{deal.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{deal.category}</Badge>
                </TableCell>
                <TableCell>₹{deal.price.toLocaleString('en-IN')}</TableCell>
                <TableCell>
                  {deal.isHotDeal && (
                    <Badge variant="destructive" className="flex items-center w-fit">
                      <Flame className="h-3 w-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{format(new Date(deal.expireAt), 'PPP')}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(deal.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

DealsTable.Skeleton = function DealsTableSkeleton() {
  return (
     <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]"><Skeleton className="h-5 w-full" /></TableHead>
            <TableHead><Skeleton className="h-5 w-full" /></TableHead>
            <TableHead><Skeleton className="h-5 w-full" /></TableHead>
            <TableHead><Skeleton className="h-5 w-full" /></TableHead>
            <TableHead><Skeleton className="h-5 w-full" /></TableHead>
            <TableHead><Skeleton className="h-5 w-full" /></TableHead>
            <TableHead className="text-right"><Skeleton className="h-5 w-full" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
             <TableRow key={i}>
                <TableCell><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-5 w-4/5" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-6 w-14 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
