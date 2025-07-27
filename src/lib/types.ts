export interface Deal {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  link: string;
  category: string;
  createdAt: string; // ISO 8601 string
  expireAt: string; // ISO 8601 string
  isHotDeal: boolean;
}

export interface FooterSettings {
    privacyPolicyUrl: string;
    termsOfServiceUrl: string;
    twitterUrl: string;
    githubUrl: string;
    linkedinUrl: string;
    youtubeUrl: string;
}
