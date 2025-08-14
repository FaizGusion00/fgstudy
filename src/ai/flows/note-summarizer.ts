
'use server';

/**
 * @fileOverview A note summarization AI agent.
 *
 * - summarizeNote - A function that summarizes lecture notes into bullet points.
 * - SummarizeNoteInput - The input type for the summarizeNote function.
 * - SummarizeNoteOutput - The return type for the summarizeNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNoteInputSchema = z.object({
  notes: z.string().describe('The lecture notes to summarize.'),
});
export type SummarizeNoteInput = z.infer<typeof SummarizeNoteInputSchema>;

const SummarizeNoteOutputSchema = z.object({
  summary: z.string().describe('The summarized notes in bullet points.'),
});
export type SummarizeNoteOutput = z.infer<typeof SummarizeNoteOutputSchema>;

export async function summarizeNote(input: SummarizeNoteInput): Promise<SummarizeNoteOutput> {
  return summarizeNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNotePrompt',
  input: {schema: SummarizeNoteInputSchema},
  output: {schema: SummarizeNoteOutputSchema},
  prompt: `You are an expert academic summarizer for students. Your task is to summarize the provided text professionally and diligently. The summary should be detailed and clear, keeping all the main ideas and important supporting details so that a student can use it for their notes and revision without missing crucial information. Do not over-simplify the content. The goal is to create a summary that is both comprehensive and easy to understand and remember. Structure the output as a list of bullet points. Please respond in the same language as the input notes.

Notes: {{{notes}}}`,
});

const summarizeNoteFlow = ai.defineFlow(
  {
    name: 'summarizeNoteFlow',
    inputSchema: SummarizeNoteInputSchema,
    outputSchema: SummarizeNoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
