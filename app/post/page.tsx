import { TopNav } from '@/components/top-nav';
import { getFilesFrontMatter } from '@/src/utils/mdx';
import { PostList } from '@/components/recent-posts/post-list'
import Link from 'next/link';

export default async function Post() {
  const allPostFrontMatter = await getFilesFrontMatter();

  return (
    <main className="mx-auto max-w-3xl xl:max-w-4xl flex min-h-screen flex-col">
      <TopNav />
      <section className='mx-auto max-w-3xl xl:max-w-4xl pt-4 pb-10'> 
        <Link href="/" className='dark:text-slate-400 hover:underline underline-offset-4 animate-opacity my-4'>
          {">"} cd ..
        </Link>
        <PostList posts={allPostFrontMatter} delay={0} />
      </section>
    </main>
  )
}
