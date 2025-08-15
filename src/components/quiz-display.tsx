
'use client';

import * as React from 'react';
import {Check, VenetianMask, X} from 'lucide-react';

import type {GenerateQuizOutput} from '@/ai/flows/quiz-generator';
import {cn} from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';

interface QuizDisplayProps {
  quizData: GenerateQuizOutput;
  onCheckAnswers: (answers: Record<number, string>) => void;
  onRetakeQuiz: () => void;
  showResults: boolean;
  selectedAnswers: Record<number, string>;
  setSelectedAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

export function QuizDisplay({
  quizData,
  onCheckAnswers,
  onRetakeQuiz,
  showResults,
  selectedAnswers,
  setSelectedAnswers,
}: QuizDisplayProps) {

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleCheckAnswers = () => {
    onCheckAnswers(selectedAnswers);
  };

  const getOptionClass = (
    questionIndex: number,
    option: string,
    correctAnswer: string
  ) => {
    if (!showResults) return '';
    const selected = selectedAnswers[questionIndex];
    if (option === correctAnswer) return 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700';
    if (option === selected && option !== correctAnswer)
      return 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700';
    return '';
  };

  const getIcon = (
    questionIndex: number,
    option: string,
    correctAnswer: string
  ) => {
    if (!showResults) return null;
    const selected = selectedAnswers[questionIndex];
    if (option === correctAnswer)
      return <Check className="ml-auto size-5 text-green-600" />;
    if (option === selected && option !== correctAnswer)
      return <X className="ml-auto size-5 text-red-600" />;
    return null;
  };

  const allQuestionsAnswered =
    Object.keys(selectedAnswers).length === quizData.questions.length;

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full" defaultValue={showResults ? undefined : "item-0"}>
        {quizData.questions.map((q, i) => (
          <AccordionItem value={`item-${i}`} key={i}>
            <AccordionTrigger className="font-headline text-left">
              <span className="mr-2">{i + 1}.</span>
              {q.question}
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                onValueChange={value => handleAnswerChange(i, value)}
                value={selectedAnswers[i]}
                disabled={showResults}
              >
                <div className="space-y-2">
                  {q.options.map((option, j) => (
                    <Label
                      key={j}
                      htmlFor={`q${i}-option${j}`}
                      className={cn(
                        'flex items-center space-x-3 rounded-md border p-4 transition-all hover:bg-accent/50',
                        getOptionClass(i, option, q.correctAnswer)
                      )}
                    >
                      <RadioGroupItem value={option} id={`q${i}-option${j}`} />
                      <span>{option}</span>
                      {getIcon(i, option, q.correctAnswer)}
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <Button
        onClick={showResults ? onRetakeQuiz : handleCheckAnswers}
        disabled={!showResults && !allQuestionsAnswered}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
      >
        <VenetianMask className="mr-2" />
        {showResults ? 'Retake Quiz' : 'Check Answers'}
      </Button>
    </div>
  );
}
