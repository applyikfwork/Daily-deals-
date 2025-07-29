
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Deal Finder - Your Source for the Hottest Online Deals',
    template: '%s | Deal Finder',
  },
  description: 'Find the best daily deals on electronics, fashion, home appliances, and more. Your one-stop destination for the hottest discounts on the web.',
  keywords: ['deals', 'discounts', 'offers', 'tech deals', 'fashion discounts', 'daily deals'],
  openGraph: {
    title: 'Deal Finder - Your Source for the Hottest Online Deals',
    description: 'Find the best daily deals on electronics, fashion, home appliances, and more.',
    url: 'https://your-website.com', // Replace with your actual domain
    siteName: 'Deal Finder',
    images: [
      {
        url: 'https://your-website.com/og-image.png', // Replace with a link to a great OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deal Finder - Your Source for the Hottest Online Deals',
    description: 'Find the best daily deals on electronics, fashion, home appliances, and more.',
    // images: ['https://your-website.com/og-image.png'], // Replace with your OG image URL
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head />
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
      </body>
    </html>
  );
}
