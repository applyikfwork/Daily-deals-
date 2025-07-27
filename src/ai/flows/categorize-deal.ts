'use server';

/**
 * @fileOverview A deal categorization AI agent.
 *
 * - categorizeDeal - A function that handles the deal categorization process.
 * - CategorizeDealInput - The input type for the categorizeDeal function.
 * - CategorizeDealOutput - The return type for the categorizeDeal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeDealInputSchema = z.object({
  title: z.string().describe('The title of the deal.'),
  description: z.string().describe('The description of the deal.'),
});
export type CategorizeDealInput = z.infer<typeof CategorizeDealInputSchema>;

const CategorizeDealOutputSchema = z.object({
  category: z.string().describe('The category of the deal.'),
});
export type CategorizeDealOutput = z.infer<typeof CategorizeDealOutputSchema>;

export async function categorizeDeal(input: CategorizeDealInput): Promise<CategorizeDealOutput> {
  return categorizeDealFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeDealPrompt',
  input: {schema: CategorizeDealInputSchema},
  output: {schema: CategorizeDealOutputSchema},
  prompt: `You are an expert in categorizing deals based on their titles and descriptions.

  Analyze the following deal title and description and determine the most appropriate category for the deal. Return only the category name.

  Title: {{{title}}}
  Description: {{{description}}}
  `,
});

const categorizeDealFlow = ai.defineFlow(
  {
    name: 'categorizeDealFlow',
    inputSchema: CategorizeDealInputSchema,
    outputSchema: CategorizeDealOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
