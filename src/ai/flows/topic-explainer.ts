
'use server';

/**
 * @fileOverview Provides a clear, simple explanation of a given topic with examples.
 *
 * - explainTopic - A function that handles the topic explanation process.
 * - ExplainTopicInput - The input type for the explainTopic function.
 * - ExplainTopicOutput - The return type for the explainTopicOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTopicInputSchema = z.object({
  topic: z.string().describe('The concept or topic to explain.'),
});
export type ExplainTopicInput = z.infer<typeof ExplainTopicInputSchema>;

const ExplainTopicOutputSchema = z.object({
  explanation: z.string().describe('A clear and simple explanation of the topic with examples, formatted in Markdown.'),
});
export type ExplainTopicOutput = z.infer<typeof ExplainTopicOutputSchema>;

export async function explainTopic(input: ExplainTopicInput): Promise<ExplainTopicOutput> {
  return explainTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTopicPrompt',
  input: {schema: ExplainTopicInputSchema},
  output: {schema: ExplainTopicOutputSchema},
  prompt: `You are an expert tutor, skilled at explaining complex topics in simple terms. Please respond in the same language as the input topic.

  Explain the following topic in a way that a student can easily understand it. Include examples to illustrate the concept.

  Format your response using Markdown, including headings, bold text for key terms, and lists for key ideas. Use LaTeX for any mathematical equations, wrapping inline math with single dollar signs (e.g., $E=mc^2$) and block math with double dollar signs (e.g., $$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$). For code blocks, use triple backticks with the language specified (e.g., \`\`\`javascript).

  Topic: {{{topic}}}`,
});

const explainTopicFlow = ai.defineFlow(
  {
    name: 'explainTopicFlow',
    inputSchema: ExplainTopicInputSchema,
    outputSchema: ExplainTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
