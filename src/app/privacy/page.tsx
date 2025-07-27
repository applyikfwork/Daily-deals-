
export default function PrivacyPage() {
  const effectiveDate = "July 27, 2024";
  const websiteName = "Deal Finder";
  const websiteUrl = "your-website.com"; 
  const contactEmail = "contact@your-website.com";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-background/80 backdrop-blur-sm rounded-2xl py-12 px-6 md:px-12 border">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
          Privacy Policy
        </h1>
        <p className="text-center text-muted-foreground mb-8">Effective Date: {effectiveDate}</p>
        <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground space-y-6">
            <p>
                At {websiteName}, accessible from {websiteUrl}, one of our main priorities is the privacy of our visitors.
            </p>
            
            <h2 className="text-2xl font-bold text-foreground">1. What Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>We do not collect personal data unless you choose to contact us or subscribe.</li>
                <li>Non-personal data such as browser type, pages visited, and visit duration may be collected through analytics tools.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground">2. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>To analyze website performance</li>
                <li>To respond to inquiries or support requests</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground">3. Cookies</h2>
            <p>
                We may use cookies for basic tracking and affiliate linking purposes. You can disable cookies in your browser settings.
            </p>

            <h2 className="text-2xl font-bold text-foreground">4. Third-Party Services</h2>
            <p>
                We use third-party services like Google Analytics and affiliate programs (e.g., Amazon Associates), which may collect data as per their own policies.
            </p>

            <h2 className="text-2xl font-bold text-foreground">5. Data Protection</h2>
            <p>
                We take reasonable measures to protect your information, but cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold text-foreground">6. Your Rights</h2>
            <p>
                You have the right to access, update, or delete your data. Contact us at <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>.
            </p>

            <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
            <p>
                If you have questions, email us at <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>.
            </p>
        </div>
      </div>
    </div>
  );
}
