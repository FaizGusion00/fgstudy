import type * as React from 'react';

import {CopyButton} from '@/components/copy-button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ResultCardProps {
  title: string;
  textToCopy: string;
  children: React.ReactNode;
}

export function ResultCard({title, textToCopy, children}: ResultCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
        <CopyButton textToCopy={textToCopy} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
