import { Metadata } from 'next';
import Link from 'next/link';
import { TopNav } from '@/components/top-nav';
import { Tag } from '@/components/tag';
import { getTags, kebabCase } from '@/src/utils/mdx';

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
  icons: '',
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
  const { slug } = params;
  const tags = await getTags();
  const sortedKeys = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-4xl xl:px-0 flex min-h-screen flex-col items-center">
      <TopNav />
      <div className="text-5xl dark:text-white mt-10">🚧 Work in Progress</div>
    </main>
  );
}
