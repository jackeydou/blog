import { Metadata } from 'next';
import { TopNav } from '@/components/top-nav';
import supabase from '@/src/supabase';
import { MobileNav } from '@/components/mobile/nav';
import { Book } from '@/components/book';
import { BubbleAnimationText } from '@/components/bubble-text';
import { IBook } from '@/src/types/book';

export const metadata: Metadata = {
  title: "Dou's Books",
  authors: {
    name: 'Jackey Dou',
  },
  keywords: 'Programming, Frontend, Life',
  generator: 'Next.js',
  themeColor: 'dark',
  description: '',
  viewport: 'width=device-width, initial-scale=1',
  creator: 'jackey.dou',
  icons: '/static/images/logo.svg',
  openGraph: {
    type: 'website',
    url: 'https://jackey.libertylab.icu',
    title: "Dou's Books",
    description: '',
    siteName: "Dou's Books",
  },
  other: {
    email: 'jackey.dou@gmail.com',
    github: 'https://github.com/jackeydou',
    twitter: 'https://twitter.com/L3Lom0',
  },
};

export default async function Books({ params }: { params: { slug: string[] } }) {
  const { data: books } = await supabase.from('Books').select('*');
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-4xl xl:px-0 flex min-h-screen flex-col">
      <TopNav className="lg:flex" />
      <BubbleAnimationText text="Books" />
      <div className="animate-fadein-b">
        {(books as IBook[]).map((book) => (
          <Book key={book.id} book={book} />
        ))}
      </div>
      <MobileNav className="lg:hidden" />
    </main>
  );
}
