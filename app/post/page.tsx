import { TopNav } from '@/components/top-nav';
import { getFilesFrontMatter } from '@/src/utils/mdx';
import { PostList } from '@/components/recent-posts/post-list'
import Link from 'next/link';
import { MobileNav } from '@/components/mobile/nav';
import { BubbleAnimationText } from '@/components/bubble-text';

export default async function Post() {
  const allPostFrontMatter = await getFilesFrontMatter();

  return (
    <main className="mx-auto max-w-3xl xl:max-w-4xl flex min-h-screen flex-col px-4 lg:px-0 pt-20 lg:pt-0">
      <TopNav className='lg:flex'/>
      <BubbleAnimationText className='lg:hidden' text="Posts" />
      <section className='mx-auto max-w-3xl xl:max-w-4xl pt-4 pb-10'> 
        <Link href="/" className='dark:text-slate-400 opacity-0 hover:underline underline-offset-4 animate-opacity my-4'>
          {">"} cd ..
        </Link>
        <PostList posts={allPostFrontMatter} delay={0} />
      </section>
      <MobileNav className='lg:hidden'/>
    </main>
  )
}
