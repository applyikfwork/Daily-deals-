import type { Deal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

type TopDealBannerProps = {
  deal: Deal;
};

export default function TopDealBanner({ deal }: TopDealBannerProps) {
  const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);

  return (
    <section className="relative overflow-hidden rounded-2xl bg-secondary p-8 text-secondary-foreground shadow-lg animate-fade-in-down">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-5"></div>
      <div className="relative grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-center md:text-left">
          <Badge variant="default" className="text-sm py-1 px-3 bg-accent text-accent-foreground shadow-md">🔥 Today’s Top Deal</Badge>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter">{deal.title}</h1>
          <p className="text-lg lg:text-xl text-muted-foreground">
            Now at ₹{deal.price.toLocaleString('en-IN')}{' '}
            <span className="line-through ml-2 opacity-70 text-base">
              ₹{deal.originalPrice.toLocaleString('en-IN')}
            </span>
          </p>
           <div className="flex items-center gap-4 justify-center md:justify-start">
            <span className="font-bold text-green-600 text-lg">{discount}% OFF</span>
            <Button asChild size="lg" className="shadow-lg">
                <Link href={deal.link}>Grab Deal</Link>
            </Button>
           </div>
        </div>
        <div className="hidden md:flex justify-center items-center">
            <Image
              src={deal.imageUrl}
              alt={deal.title}
              width={400}
              height={400}
              className="rounded-xl object-cover aspect-square shadow-2xl transition-transform duration-500 hover:scale-105"
              data-ai-hint="product photo"
            />
        </div>
      </div>
    </section>
  );
}
