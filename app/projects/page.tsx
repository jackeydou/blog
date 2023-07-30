import Link from 'next/link';
import { TopNav } from '@/components/top-nav';
import { Tag } from '@/components/tag';
import { getTags, kebabCase } from '@/src/utils/mdx';

export default async function Tags({ params }: { params: { slug: string[] } }) {
  const { slug } = params;
  const tags = await getTags()
  const sortedKeys = Object.keys(tags).sort((a, b) => tags[b] - tags[a])
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-4xl xl:px-0 flex min-h-screen flex-col items-center">
      <TopNav />
      <div className='text-5xl dark:text-white mt-10'>🚧 Work in Progress</div>
    </main>
  )
}
