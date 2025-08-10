
'use client';

import * as React from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {Wand2} from 'lucide-react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {explainTopic} from '@/ai/flows/topic-explainer';
import {LoadingSpinner} from '@/components/loading-spinner';
import {ResultCard} from '@/components/result-card';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';

const formSchema = z.object({
  topic: z.string().min(3, {
    message: 'Please enter a topic.',
  }),
});

export function TopicExplainer() {
  const [explanation, setExplanation] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setExplanation('');
    try {
      const result = await explainTopic({topic: values.topic});
      setExplanation(result.explanation);
    } catch (error) {
      console.error('Error explaining topic:', error);
      // TODO: Add error toast
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="topic"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter a concept or topic, e.g., 'Quantum Physics'"
                    className="shadow-sm"
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
            Explain Topic
          </Button>
        </form>
      </Form>

      {isLoading && <LoadingSpinner />}

      {explanation && (
        <ResultCard title="Explanation" textToCopy={explanation}>
          <div className="prose prose-sm max-w-none text-foreground prose-p:my-2 prose-headings:font-headline">
            {explanation.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </ResultCard>
      )}
    </div>
  );
}
