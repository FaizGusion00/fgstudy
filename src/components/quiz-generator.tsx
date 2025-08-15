
'use client';

import * as React from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {Wand2, Clock, Target} from 'lucide-react';
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Slider} from '@/components/ui/slider';
import {Textarea} from '@/components/ui/textarea';
import { Card, CardContent } from './ui/card';

const formSchema = z.object({
  text: z.string().min(100, {
    message: 'Please enter at least 100 characters to generate a quiz.',
  }),
  numberOfQuestions: z.number().min(5).max(40),
});

export function QuizGenerator() {
  const [quizData, setQuizData] = React.useState<GenerateQuizOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [endTime, setEndTime] = React.useState<number | null>(null);
  const [showResults, setShowResults] = React.useState(false);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number,string>>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      numberOfQuestions: 15,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuizData(null);
    setShowResults(false);
    setSelectedAnswers({});
    setStartTime(null);
    setEndTime(null);
    try {
      const result = await generateQuiz({
        text: values.text,
        numberOfQuestions: values.numberOfQuestions,
      });
      setQuizData(result);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Error generating quiz:', error);
      // TODO: Add error toast
    } finally {
      setIsLoading(false);
    }
  }

  const handleCheckAnswers = (answers: Record<number, string>) => {
    setSelectedAnswers(answers);
    setEndTime(Date.now());
    setShowResults(true);
  };

  const handleRetakeQuiz = () => {
    setShowResults(false);
    setSelectedAnswers({});
    setEndTime(null);
    // Note: We don't reset startTime here, so the "Retake" is part of the same session.
    // If a full reset is desired, we can call `onSubmit` again or just reset all state.
  };

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

  const score = React.useMemo(() => {
    if (!showResults || !quizData) return 0;
    return quizData.questions.reduce((acc, q, i) => {
      return selectedAnswers[i] === q.correctAnswer ? acc + 1 : acc;
    }, 0);
  }, [showResults, quizData, selectedAnswers]);

  const timeTaken = React.useMemo(() => {
    if (!endTime || !startTime) return '0s';
    const seconds = Math.floor((endTime - startTime) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }, [endTime, startTime]);


  const numberOfQuestions = form.watch('numberOfQuestions');

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
          <FormField
            control={form.control}
            name="numberOfQuestions"
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  Number of Questions:{' '}
                  <span className="font-bold">{numberOfQuestions}</span>
                </FormLabel>
                <FormControl>
                  <Slider
                    min={5}
                    max={40}
                    step={1}
                    value={[field.value]}
                    onValueChange={vals => field.onChange(vals[0])}
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

      {quizData && startTime && (
        <ResultCard title="Your Quiz" textToCopy={quizTextForClipboard}>
          <div className="min-h-48 max-h-[60vh] overflow-y-auto pr-2">
            <QuizDisplay 
              quizData={quizData} 
              onCheckAnswers={handleCheckAnswers}
              onRetakeQuiz={handleRetakeQuiz}
              showResults={showResults}
              selectedAnswers={selectedAnswers}
              setSelectedAnswers={setSelectedAnswers}
            />
          </div>
        </ResultCard>
      )}

      {showResults && quizData && (
        <Card className="bg-muted/50 dark:bg-muted/20 border-none shadow-inner data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95">
            <CardContent className="grid grid-cols-2 gap-4 p-4 text-center">
              <div className="flex flex-col items-center justify-center space-y-1">
                <Target className="size-8 text-primary-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">Score</h3>
                <p className="font-bold text-2xl font-headline">
                  {score}
                  <span className="text-base font-body text-muted-foreground">/{quizData.questions.length}</span>
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1">
                <Clock className="size-8 text-primary-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">Time Taken</h3>
                <p className="font-bold text-2xl font-headline">{timeTaken}</p>
              </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
