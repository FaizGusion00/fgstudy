
'use client';

import * as React from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {Wand2} from 'lucide-react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {summarizeNote} from '@/ai/flows/note-summarizer';
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
import {Textarea} from '@/components/ui/textarea';

const formSchema = z.object({
  notes: z.string().min(50, {
    message: 'Please enter at least 50 characters for a good summary.',
  }),
});

export function NoteSummarizer() {
  const [summary, setSummary] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizeNote({notes: values.notes});
      setSummary(result.summary);
    } catch (error) {
      console.error('Error summarizing notes:', error);
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
            name="notes"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Paste your lecture notes or any text here..."
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
            Summarize Notes
          </Button>
        </form>
      </Form>

      {isLoading && <LoadingSpinner />}

      {summary && (
        <ResultCard title="Summary" textToCopy={summary}>
          <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
            {summary
              .split('\n')
              .filter(line => line.trim().length > 0)
              .map((line, index) => (
                <li key={index}>{line.replace(/[-*] /g, '')}</li>
              ))}
          </ul>
        </ResultCard>
      )}
    </div>
  );
}
