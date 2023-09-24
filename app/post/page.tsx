import { Metadata } from 'next';
import { TopNav } from '@/components/top-nav';
import { getFilesFrontMatter } from '@/src/utils/mdx';
import { PostList } from '@/components/recent-posts/post-list';
import Link from 'next/link';
import { MobileNav } from '@/components/mobile/nav';
import { BubbleAnimationText } from '@/components/bubble-text';

export const metadata: Metadata = {
  title: "Dou's Posts",
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
    title: "Dou's Posts",
    description: '',
    siteName: "Dou's Posts",
  },
  other: {
    email: 'jackey.dou@gmail.com',
    github: 'https://github.com/jackeydou',
    twitter: 'https://twitter.com/L3Lom0',
  },
};

export const revalidate = 86400;

export default async function Post() {
  const allPostFrontMatter = await getFilesFrontMatter();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col px-6 py-2 pb-10 pt-20 sm:px-8 md:px-16 lg:pt-0">
      <TopNav className="lg:flex" />
      <section className="mx-auto max-w-3xl pb-10 pt-4 xl:max-w-4xl">
        <BubbleAnimationText className="lg:hidden" text="Posts" />
        <Link
          href="/"
          className="my-4 animate-opacity underline-offset-4 opacity-0 hover:underline dark:text-slate-400"
        >
          {'>'} cd ..
        </Link>
        <PostList posts={allPostFrontMatter} delay={0} />
      </section>
      <MobileNav className="lg:hidden" />
    </main>
  );
}
