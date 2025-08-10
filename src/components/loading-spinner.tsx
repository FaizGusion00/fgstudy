import {Loader2} from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-16">
      <Loader2 className="size-10 animate-spin text-primary-foreground" />
    </div>
  );
}
