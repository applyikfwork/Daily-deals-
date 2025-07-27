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
    <article>
      <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-transparent hover:border-primary">
        <CardHeader className="p-0 relative">
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
              {deal.isHotDeal && (
                <Badge className="bg-accent text-accent-foreground shadow-lg" variant="destructive">
                  <Flame className="h-4 w-4 mr-1" />
                  Hot Deal
                </Badge>
              )}
               <Badge className="bg-secondary text-secondary-foreground shadow-lg" variant="secondary">
                  <Tag className="h-4 w-4 mr-1" />
                  {deal.category}
                </Badge>
          </div>
           <div className="overflow-hidden rounded-t-lg">
               <Image
                src={deal.imageUrl}
                alt={deal.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-110"
                data-ai-hint="product photo"
              />
           </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col">
          <CardTitle className="text-lg font-bold leading-tight mb-2 h-14 line-clamp-2">
            <Link href={deal.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300">
              {deal.title}
            </Link>
          </CardTitle>
          <div className="flex-grow"></div>
          <div className="mt-2">
              <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-extrabold text-primary">₹{deal.price.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-muted-foreground line-through">₹{deal.originalPrice.toLocaleString('en-IN')}</p>
              </div>
              <p className="text-green-600 font-semibold text-sm mt-1">{discount}% off</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col items-stretch gap-3">
          {deal.expireAt && <Countdown expireAt={deal.expireAt} />}
          <Button asChild className="w-full">
            <Link href={deal.link} target="_blank" rel="noopener noreferrer">
              Grab Now
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </article>
  );
}
