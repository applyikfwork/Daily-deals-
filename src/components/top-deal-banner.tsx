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
    <section className="rounded-2xl bg-gradient-to-r from-primary to-accent p-6 sm:p-8 md:p-10 text-primary-foreground shadow-lg animate-fade-in-down">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <Badge variant="destructive" className="text-sm py-1 px-3">🔥 Today’s Top Deal</Badge>
          <h1 className="text-3xl lg:text-4xl font-bold">{deal.title}</h1>
          <p className="text-lg lg:text-xl">
            Now at ₹{deal.price.toLocaleString('en-IN')}{' '}
            <span className="line-through ml-2 opacity-80 text-base">
              ₹{deal.originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="ml-3 font-semibold text-green-300">{discount}% off</span>
          </p>
          <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link href={deal.link}>View Deal</Link>
          </Button>
        </div>
        <div className="hidden md:flex justify-center items-center">
            <Image
              src={deal.imageUrl}
              alt={deal.title}
              width={400}
              height={400}
              className="rounded-lg object-cover aspect-square shadow-2xl"
              data-ai-hint="product photo"
            />
        </div>
      </div>
    </section>
  );
}
