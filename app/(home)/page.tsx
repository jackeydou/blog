import { PropsWithChildren } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Screen } from '@/components/screen'
import { Intro } from '@/components/intro'
import { SideInfo } from '@/components/side-info'
import { SideNav } from '@/components/side-nav'
import { Experiences } from '@/components/experiences'
import { RecentPosts } from '@/components/recent-posts'
import { getFilesFrontMatter } from '@/src/utils/mdx'
import { PostHeader } from '@/src/types/post'

export default async function Home() {
  const recentPosts: PostHeader[] = await getFilesFrontMatter('blog', 8)
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Intro />
      <RecentPosts posts={recentPosts} />
      <Experiences />
      <SideInfo />
      <SideNav />
    </main>
  )
}
