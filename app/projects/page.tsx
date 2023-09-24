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
    <main className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col items-center px-6 py-2 pb-10 pt-20 sm:px-8 md:px-16 lg:pt-0">
      <TopNav className="lg:flex" />
      <div className="mt-10 text-5xl dark:text-white">🚧 Work in Progress</div>
      <MobileNav className="lg:hidden" />
    </main>
  );
}
