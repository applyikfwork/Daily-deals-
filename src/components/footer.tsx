import Link from 'next/link';
import { Package2, Twitter, Linkedin, Youtube } from 'lucide-react';
import { getFooterSettings } from '@/lib/data';

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const settings = await getFooterSettings();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Package2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Deal Finder</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your daily source for the hottest deals on the web.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </Link>
              </div>
            </div>
             <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link>
                </li>
                <li>
                  <Link href="/history" className="text-sm hover:text-primary transition-colors">Deal History</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-sm">
             <h3 className="font-semibold mb-4 text-secondary-foreground">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={settings.privacyPolicyUrl} className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href={settings.termsOfServiceUrl} className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link href={settings.affiliateDisclaimerUrl} className="text-sm text-muted-foreground hover:text-primary transition-colors">Affiliate Disclaimer</Link>
                </li>
              </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Deal Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
