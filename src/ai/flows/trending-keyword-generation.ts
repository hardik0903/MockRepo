'use server';

/**
 * @fileOverview An AI agent that analyzes tweets and identifies trending keywords.
 *
 * - generateTrendingKeywords - A function that handles the trending keyword generation process.
 * - GenerateTrendingKeywordsInput - The input type for the generateTrendingKeywords function.
 * - GenerateTrendingKeywordsOutput - The return type for the generateTrendingKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTrendingKeywordsInputSchema = z.object({
  tweet: z.string().describe('The content of the tweet to analyze.'),
});
export type GenerateTrendingKeywordsInput = z.infer<
  typeof GenerateTrendingKeywordsInputSchema
>;

const GenerateTrendingKeywordsOutputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe('A list of trending keywords identified in the tweet.'),
});
export type GenerateTrendingKeywordsOutput = z.infer<
  typeof GenerateTrendingKeywordsOutputSchema
>;

export async function generateTrendingKeywords(
  input: GenerateTrendingKeywordsInput
): Promise<GenerateTrendingKeywordsOutput> {
  return generateTrendingKeywordsFlow(input);
}

const trendingKeywordsPrompt = ai.definePrompt({
  name: 'trendingKeywordsPrompt',
  input: {schema: GenerateTrendingKeywordsInputSchema},
  output: {schema: GenerateTrendingKeywordsOutputSchema},
  prompt: `You are an expert in identifying trending keywords from tweets.

  Analyze the following tweet and extract a list of trending keywords that are most relevant to the tweet's content.

  Tweet: {{{tweet}}}

  Consider current events, popular hashtags, and common topics discussed on Twitter when determining the keywords.
  Return only keywords, do not add any explanations.
  `,
});

const generateTrendingKeywordsFlow = ai.defineFlow(
  {
    name: 'generateTrendingKeywordsFlow',
    inputSchema: GenerateTrendingKeywordsInputSchema,
    outputSchema: GenerateTrendingKeywordsOutputSchema,
  },
  async input => {
    const {output} = await trendingKeywordsPrompt(input);
    return output!;
  }
);
