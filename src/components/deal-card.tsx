import type { Deal } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Countdown from '@/components/countdown';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type DealCardProps = {
  deal: Deal;
};

export default function DealCard({ deal }: DealCardProps) {
  const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        {deal.isHotDeal && (
          <Badge className="absolute top-2 left-2 z-10" variant="destructive">
            <Flame className="h-4 w-4 mr-1" />
            Hot Deal
          </Badge>
        )}
         <Badge className="absolute top-2 right-2 z-10" variant="secondary">
            <Tag className="h-4 w-4 mr-1" />
            {deal.category}
          </Badge>
        <Image
          src={deal.imageUrl}
          alt={deal.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover rounded-t-lg"
          data-ai-hint="product photo"
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold leading-tight mb-2 h-12 line-clamp-2">
          {deal.title}
        </CardTitle>
        <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-primary">₹{deal.price.toLocaleString('en-IN')}</p>
            <p className="text-sm text-muted-foreground line-through">₹{deal.originalPrice.toLocaleString('en-IN')}</p>
        </div>
        <p className="text-green-600 font-medium text-sm mt-1">{discount}% off</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-stretch gap-3">
        <Countdown expireAt={deal.expireAt} />
        <Button asChild className="w-full">
          <Link href={deal.link} target="_blank" rel="noopener noreferrer">
            Grab Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
