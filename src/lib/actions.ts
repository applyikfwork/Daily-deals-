
'use server';

import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { addDealToDb, deleteDealFromDb, addCategoryToDb, updateFooterSettingsInDb } from './data';
import { categorizeDeal } from '@/ai/flows/categorize-deal';
import type { FooterSettings } from './types';

// Schema for adding a deal from the form
const dealSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  price: z.coerce.number().positive(),
  originalPrice: z.coerce.number().positive(),
  imageUrl: z.string().url(),
  link: z.string().url(),
  category: z.string().min(1, 'Category is required.'),
  expireAt: z.string(),
  isHotDeal: z.boolean(),
});

type ActionResponse = {
  success: boolean;
  error?: string;
}

// Schema for AI categorization
const categorizeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

type CategorizeActionResponse = {
  success: boolean;
  category?: string;
  error?: string;
}

const addCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters.'),
});


const urlOrHash = z.string().refine(val => val === '#' || z.string().url().safeParse(val).success, {
  message: "Must be a valid URL or '#'",
});

const footerSettingsSchema = z.object({
  privacyPolicyUrl: urlOrHash,
  termsOfServiceUrl: urlOrHash,
  twitterUrl: urlOrHash,
  githubUrl: urlOrHash,
  linkedinUrl: urlOrHash,
  youtubeUrl: urlOrHash,
});
