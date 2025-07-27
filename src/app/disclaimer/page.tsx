
export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-background/80 backdrop-blur-sm rounded-2xl py-12 px-6 md:px-12 border">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-8">
          Affiliate Disclaimer
        </h1>
        <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground space-y-6">
            <p>
                This website contains affiliate links to products on third-party websites like Amazon, Flipkart, etc. If you click on these links and make a purchase, we may earn a commission at no extra cost to you.
            </p>
            <p>
                We are not responsible for the quality, pricing, or delivery of the products listed. All trademarks and product details belong to their respective owners.
            </p>
            <p>
                Our goal is to recommend only valuable and trustworthy deals, but we encourage users to verify the product details on the external website before making a purchase.
            </p>
        </div>
      </div>
    </div>
  );
}
