// Quiz generation flow.

'use server';

/**
 * @fileOverview Generates multiple-choice questions (MCQs) with correct answers from user-provided notes or topics.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  text: z
    .string()
    .describe('The notes or topic to generate the quiz from.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The multiple-choice question.'),
      options: z.array(z.string()).describe('The possible answers.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The generated multiple-choice questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert educator creating a multiple-choice quiz based on the provided text. The quiz should consist of 15 questions. Please respond in the same language as the input text.

  The output should be a JSON array of question objects, where each object has the following structure:
  {
  "question": "The question text",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": "The text of the correct answer"
  }

  Here is the text to generate the quiz from:
  {{text}}
  `,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
