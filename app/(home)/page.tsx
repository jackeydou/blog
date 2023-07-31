import { Intro } from '@/components/intro'
import { SideInfo } from '@/components/side-info'
import { SideNav } from '@/components/side-nav'
import { Experiences } from '@/components/experiences'
import { RecentPosts } from '@/components/recent-posts'
import { getFilesFrontMatter } from '@/src/utils/mdx'
import { PostHeader } from '@/src/types/post'
import { MobileNav } from '@/components/mobile/nav'

export default async function Home() {
  const recentPosts: PostHeader[] = await getFilesFrontMatter(8)
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Intro />
      <RecentPosts posts={recentPosts} />
      <Experiences />
      <SideInfo className="md:flex" />
      <SideNav className="md:flex" />
      <MobileNav className="md:hidden" />
    </main>
  )
}
