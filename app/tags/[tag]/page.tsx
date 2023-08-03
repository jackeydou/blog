import Link from 'next/link';
import { TopNav } from '@/components/top-nav';
import { MobileNav } from '@/components/mobile/nav';

import { Metadata } from 'next';

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

export default async function Tags({ params }: { params: { slug: string[] } }) {
  const { slug } = params;
  return (
    <main className="pt-20 lg:pt-0 mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-4xl xl:px-0 flex min-h-screen flex-col items-center">
      <TopNav className="lg:flex" />
      <MobileNav className="lg:hidden" />
      <div className="text-5xl dark:text-white mt-10">🚧 Work in Progress</div>
    </main>
  );
}
