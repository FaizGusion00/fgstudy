import {BookText, ClipboardCheck, Lightbulb} from 'lucide-react';

import {Footer} from '@/components/footer';
import {Header} from '@/components/header';
import {NoteSummarizer} from '@/components/note-summarizer';
import {QuizGenerator} from '@/components/quiz-generator';
import {TopicExplainer} from '@/components/topic-explainer';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="container mx-auto flex-grow px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="pb-12">
          <Tabs defaultValue="summarize" className="w-full max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-primary/20 p-1 h-auto">
              <TabsTrigger value="summarize" className="py-2">
                <BookText className="mr-2 size-4" /> Summarize
              </TabsTrigger>
              <TabsTrigger value="explain" className="py-2">
                <Lightbulb className="mr-2 size-4" /> Explain
              </TabsTrigger>
              <TabsTrigger value="quiz" className="py-2">
                <ClipboardCheck className="mr-2 size-4" /> Quiz
              </TabsTrigger>
            </TabsList>
            <TabsContent value="summarize" className="mt-6">
              <NoteSummarizer />
            </TabsContent>
            <TabsContent value="explain" className="mt-6">
              <TopicExplainer />
            </TabsContent>
            <TabsContent value="quiz" className="mt-6">
              <QuizGenerator />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Footer />
    </div>
  );
}
