import Link from 'next/link';
import { Metadata } from 'next';
import { TopNav } from '@/components/top-nav';
import { MobileNav } from '@/components/mobile/nav';
import { getFilesFrontMatter, kebabCase } from '@/src/utils/mdx';
import { PostList } from '@/components/recent-posts/post-list';
import { BubbleAnimationText } from '@/components/bubble-text';

export const metadata: Metadata = {
  title: "Dou's Website",
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
    title: "Dou's Website",
    description: '',
    siteName: "Dou's Website",
  },
  other: {
    email: 'jackey.dou@gmail.com',
    github: 'https://github.com/jackeydou',
    twitter: 'https://twitter.com/L3Lom0',
  },
};

export default async function Tags({ params }: { params: { tag: string } }) {
  const { tag } = params;
  const frontmatters = (await getFilesFrontMatter()).filter((it) => {
    return Array.isArray(it.tags)
      ? it.tags.map((it) => kebabCase(it)).includes(tag)
      : it.tags === tag;
  });
  return (
    <main className="mx-auto max-w-3xl xl:max-w-4xl flex min-h-screen flex-col px-4 lg:px-0 pt-20 lg:pt-0">
      <TopNav className="lg:flex" />
      <section className="mx-auto max-w-3xl xl:max-w-4xl pt-4 pb-10">
        <BubbleAnimationText text={`About - ${tag}`} />
        <Link
          href="/"
          className="dark:text-slate-400 opacity-0 hover:underline underline-offset-4 animate-opacity my-4"
        >
          {'>'} cd ..
        </Link>
        <PostList posts={frontmatters} delay={0} />
      </section>
      <MobileNav className="lg:hidden" />
    </main>
  );
}
