'use server';
/**
 * @fileOverview An AI-powered product recommendation agent.
 *
 * - getProductRecommendations - A function that retrieves product recommendations based on transaction history.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  transactionHistory: z
    .string()
    .describe(
      'A string containing the transaction history, including products purchased, quantities, and timestamps.'
    ),
  otherRelevantData: z
    .string()
    .optional()
    .describe(
      'Any other relevant data, such as customer demographics or browsing history.'
    ),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z
    .array(z.string())
    .describe('An array of product codes that are recommended.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the product recommendations, explaining why each product is suggested.'
    ),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(
  input: ProductRecommendationsInput
): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to provide product recommendations to cashiers based on customer transaction history.

  Analyze the transaction history and other relevant data provided to identify potential products the customer might want to add to their purchase.
  Provide a list of product codes for the recommended products and explain the reasoning behind each recommendation.

  Transaction History: {{{transactionHistory}}}
  Other Relevant Data: {{{otherRelevantData}}}

  Output the recommended products as a JSON array of product codes, and the reasoning behind the recommendations in the "reasoning" field.
  `,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
