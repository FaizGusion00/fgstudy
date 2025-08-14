
'use client';

import * as React from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {Wand2} from 'lucide-react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import ReactMarkdown from 'react-markdown';

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
          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground prose-p:my-2 prose-headings:font-headline prose-strong:font-bold prose-ul:list-disc prose-ul:pl-5">
            <ReactMarkdown
              components={{
                p: ({node, ...props}) => <p className="my-2 leading-relaxed" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 my-2 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="my-1" {...props} />,
              }}
            >{summary}</ReactMarkdown>
          </div>
        </ResultCard>
      )}
    </div>
  );
}
