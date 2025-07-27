
export default function TermsPage() {
  const effectiveDate = "July 27, 2024";
  const websiteName = "Deal Finder";
  const websiteUrl = "your-website.com"; 
  const contactEmail = "contact@your-website.com";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-background/80 backdrop-blur-sm rounded-2xl py-12 px-6 md:px-12 border">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
          Terms and Conditions
        </h1>
        <p className="text-center text-muted-foreground mb-8">Effective Date: {effectiveDate}</p>

        <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground space-y-6">
            <p>
                Welcome to {websiteName}! These Terms and Conditions govern your use of our website located at {websiteUrl} and form a binding agreement between you and us.
            </p>
            <p>
                By accessing or using our website, you agree to be bound by these Terms. If you do not agree with any part, please do not use the site.
            </p>
            
            <h2 className="text-2xl font-bold text-foreground">1. Use of the Website</h2>
            <p>
                You agree to use this site only for lawful purposes. You may not use the website in any way that may harm us, the website, or any third party.
            </p>

            <h2 className="text-2xl font-bold text-foreground">2. Affiliate Links and Commissions</h2>
            <p>
                We feature products from third-party e-commerce websites (like Amazon, Flipkart, etc.). If you click on an affiliate link and make a purchase, we may earn a small commission at no extra cost to you. This supports our website operations.
            </p>

            <h2 className="text-2xl font-bold text-foreground">3. No Responsibility for External Products</h2>
            <p>
                We do not manufacture or sell any of the products listed. All product details, prices, and availability are managed by the respective external websites. We do not guarantee accuracy or availability.
            </p>

            <h2 className="text-2xl font-bold text-foreground">4. Intellectual Property</h2>
            <p>
                All content, trademarks, and design on this website are the property of {websiteName} or its licensors.
            </p>
            
            <h2 className="text-2xl font-bold text-foreground">5. Termination</h2>
            <p>
                We reserve the right to suspend or terminate access to the website without notice for any user who violates these terms.
            </p>
            
            <h2 className="text-2xl font-bold text-foreground">6. Changes to Terms</h2>
            <p>
                We may update these Terms from time to time. Continued use of the website after changes indicates your acceptance.
            </p>

            <h2 className="text-2xl font-bold text-foreground">Contact</h2>
            <p>
                If you have any questions about these Terms, contact us at <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>.
            </p>
        </div>
      </div>
    </div>
  );
}
