
'use client';

import * as React from 'react';
import {Check, Copy} from 'lucide-react';

import {useToast} from '@/hooks/use-toast';
import {Button} from '@/components/ui/button';

interface CopyButtonProps {
  textToCopy: string;
}

export function CopyButton({textToCopy}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);
  const {toast} = useToast();

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setHasCopied(true);
        toast({
          title: 'Copied to clipboard!',
          description: 'You can now paste the content anywhere.',
        });
        setTimeout(() => {
          setHasCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
          variant: 'destructive',
          title: 'Failed to copy',
          description: 'Could not copy text to clipboard.',
        });
      });
  };

  return (
    <Button variant="ghost" size="icon" onClick={copyToClipboard}>
      {hasCopied ? (
        <Check className="size-4 text-emerald-500" />
      ) : (
        <Copy className="size-4" />
      )}
      <span className="sr-only">Copy to clipboard</span>
    </Button>
  );
}
