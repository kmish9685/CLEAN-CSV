'use server';

/**
 * @fileOverview AI-powered tool that suggests cleaning strategies for CSV files.
 *
 * - suggestCleaningStrategies - Analyzes a CSV sample and suggests cleaning strategies.
 * - SuggestCleaningStrategiesInput - The input type for suggestCleaningStrategies.
 * - SuggestCleaningStrategiesOutput - The return type for suggestCleaningStrategies.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCleaningStrategiesInputSchema = z.object({
  csvSample: z
    .string()
    .describe('A sample of the uploaded CSV file content (e.g., first 10 rows).'),
});
export type SuggestCleaningStrategiesInput = z.infer<
  typeof SuggestCleaningStrategiesInputSchema
>;

const SuggestCleaningStrategiesOutputSchema = z.object({
  suggestedStrategies: z
    .array(z.string())
    .describe(
      'An array of suggested cleaning strategies based on the CSV sample analysis.'
    ),
});
export type SuggestCleaningStrategiesOutput = z.infer<
  typeof SuggestCleaningStrategiesOutputSchema
>;

export async function suggestCleaningStrategies(
  input: SuggestCleaningStrategiesInput
): Promise<SuggestCleaningStrategiesOutput> {
  return suggestCleaningStrategiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCleaningStrategiesPrompt',
  input: {schema: SuggestCleaningStrategiesInputSchema},
  output: {schema: SuggestCleaningStrategiesOutputSchema},
  prompt: `You are an AI assistant specializing in data cleaning and transformation.
  Analyze the following CSV sample and suggest appropriate cleaning strategies that the user can apply.
  Provide the suggestions as an array of strings.
  Examples of cleaning strategies include: "Phone Number Cleanup", "Date Standardization", "Remove Duplicates", "Trim Whitespace", "Standardize Capitalization", "Remove Special Characters".
  The suggestions should be tailored to the data identified in the sample.
  Make sure that you respond in a JSON format.

  CSV Sample:
  {{csvSample}}`,
});

const suggestCleaningStrategiesFlow = ai.defineFlow(
  {
    name: 'suggestCleaningStrategiesFlow',
    inputSchema: SuggestCleaningStrategiesInputSchema,
    outputSchema: SuggestCleaningStrategiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
