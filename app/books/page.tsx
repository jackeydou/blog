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

export const revalidate = 86400;

export default async function Books({ params }: { params: { slug: string[] } }) {
  const { data: books } = await supabase.from('Books').select('*');
  return (
    <main className="flex min-h-screen w-full max-w-screen-xl flex-col px-6 py-2 pb-10 pt-20 sm:px-8 md:px-16 lg:pt-0">
      <TopNav className="lg:flex" />
      <div className="z-10 mx-auto max-w-3xl animate-fadein-b xl:max-w-4xl">
        <BubbleAnimationText text="Books" />
        {((books as IBook[]) ?? []).map((book) => (
          <Book key={book.id} book={book} />
        ))}
      </div>
      <MobileNav className="lg:hidden" />
    </main>
  );
}
