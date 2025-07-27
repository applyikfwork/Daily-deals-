'use server';

import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { addDealToDb, deleteDealFromDb } from './data';
import { categorizeDeal } from '@/ai/flows/categorize-deal';

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

export async function addDealAction(data: unknown): Promise<ActionResponse> {
  const validationResult = dealSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  try {
    const newDealData = validationResult.data;
    await addDealToDb({
      ...newDealData,
      expireAt: new Date(newDealData.expireAt).toISOString(),
    });

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to add deal:', error);
    return { success: false, error: 'Could not add the deal.' };
  }
}

export async function deleteDealAction(id: string): Promise<ActionResponse> {
  if (!id) {
    return { success: false, error: 'Deal ID is required.' };
  }

  try {
    await deleteDealFromDb(id);
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete deal:', error);
    return { success: false, error: 'Could not delete the deal.' };
  }
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

export async function categorizeDealAction(data: unknown): Promise<CategorizeActionResponse> {
  const validationResult = categorizeSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, error: 'Title and description are required.' };
  }

  try {
    const { category } = await categorizeDeal(validationResult.data);
    return { success: true, category };
  } catch (error) {
    console.error('AI categorization failed:', error);
    return { success: false, error: 'Failed to get category from AI.' };
  }
}
