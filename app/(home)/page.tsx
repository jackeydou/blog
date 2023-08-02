import { Metadata } from 'next';
import { Intro } from '@/components/intro';
import { SideInfo } from '@/components/side-info';
import { SideNav } from '@/components/side-nav';
import { Experiences } from '@/components/experiences';
import { RecentPosts } from '@/components/recent-posts';
import { getFilesFrontMatter } from '@/src/utils/mdx';
import { PostHeader } from '@/src/types/post';
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
  icons: '',
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

export default async function Home() {
  const recentPosts: PostHeader[] = await getFilesFrontMatter(8);
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Intro />
      <RecentPosts posts={recentPosts} />
      <Experiences />
      <SideInfo className="md:flex" />
      <SideNav className="md:flex" />
      <MobileNav className="md:hidden" />
    </main>
  );
}
