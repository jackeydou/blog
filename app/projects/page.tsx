import { Metadata } from 'next';
import Link from 'next/link';
import { TopNav } from '@/components/top-nav';
import { MobileNav } from '@/components/mobile/nav';

export const metadata: Metadata = {
  title: "Dou's Projects",
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
    title: "Dou's Projects",
    description: '',
    siteName: "Dou's Projects",
  },
  other: {
    email: 'jackey.dou@gmail.com',
    github: 'https://github.com/jackeydou',
    twitter: 'https://twitter.com/L3Lom0',
  },
};

export default async function Projects({ params }: { params: { slug: string[] } }) {
  return (
    <main className="pt-20 lg:pt-0 mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-4xl xl:px-0 flex min-h-screen flex-col items-center">
      <TopNav className="lg:flex" />
      <div className="text-5xl dark:text-white mt-10">🚧 Work in Progress</div>
      <MobileNav className="lg:hidden" />
    </main>
  );
}
