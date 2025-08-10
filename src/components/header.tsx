import {Logo} from '@/components/logo';
import {ThemeToggle} from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="relative flex flex-col items-center justify-center space-y-4 py-8 text-center">
      <div className="absolute top-8 right-0">
        <ThemeToggle />
      </div>
      <Logo />
      <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        FGStudy AI
      </h1>
      <p className="text-lg text-muted-foreground">
        Your instant learning assistant.
      </p>
    </header>
  );
}
