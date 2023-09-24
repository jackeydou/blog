import { Metadata } from 'next';
import Link from 'next/link';
import { TopNav } from '@/components/top-nav';
import { Tag } from '@/components/tag';
import { getTags, kebabCase } from '@/src/utils/mdx';
import { MobileNav } from '@/components/mobile/nav';

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

export const revalidate = 604800;

export default async function Tags({ params }: { params: { slug: string[] } }) {
  const { slug } = params;
  const tags = await getTags();
  const sortedKeys = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col px-6 py-2 pb-10 pt-20 sm:px-8 md:px-16 lg:pt-0">
      <TopNav className="lg:flex" />
      <MobileNav className="lg:hidden" />
      <div className="z-10 flex animate-fadein-b flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-white sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            Tags
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {Object.keys(tags).length === 0 && 'No tags found.'}
          {sortedKeys.map((t) => {
            return (
              <div key={t} className="mb-2 mr-5 mt-2">
                <Tag text={t} />
                <Link
                  href={`/tags/${kebabCase(t)}`}
                  className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                >
                  {` (${tags[t]})`}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
