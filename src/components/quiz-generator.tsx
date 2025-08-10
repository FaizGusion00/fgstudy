
'use client';

import * as React from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {Wand2} from 'lucide-react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {generateQuiz} from '@/ai/flows/quiz-generator';
import type {GenerateQuizOutput} from '@/ai/flows/quiz-generator';
import {LoadingSpinner} from '@/components/loading-spinner';
import {QuizDisplay} from '@/components/quiz-display';
import {ResultCard} from '@/components/result-card';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {Textarea} from '@/components/ui/textarea';

const formSchema = z.object({
  text: z.string().min(100, {
    message: 'Please enter at least 100 characters to generate a quiz.',
  }),
});

export function QuizGenerator() {
  const [quizData, setQuizData] = React.useState<GenerateQuizOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuizData(null);
    try {
      const result = await generateQuiz({text: values.text});
      setQuizData(result);
    } catch (error) {
      console.error('Error generating quiz:', error);
      // TODO: Add error toast
    } finally {
      setIsLoading(false);
    }
  }

  const quizTextForClipboard = React.useMemo(() => {
    if (!quizData) return '';
    return quizData.questions
      .map(
        (q, i) =>
          `${i + 1}. ${q.question}\n${q.options
            .map(o => `   - ${o}`)
            .join('\n')}\nCorrect Answer: ${q.correctAnswer}\n`
      )
      .join('\n');
  }, [quizData]);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="text"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Paste notes or a topic to generate a quiz..."
                    className="min-h-[200px] shadow-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Wand2 className="mr-2" />
            Generate Quiz
          </Button>
        </form>
      </Form>

      {isLoading && <LoadingSpinner />}

      {quizData && (
        <ResultCard
          title="Your Quiz"
          textToCopy={quizTextForClipboard}
        >
          <QuizDisplay quizData={quizData} />
        </ResultCard>
      )}
    </div>
  );
}
