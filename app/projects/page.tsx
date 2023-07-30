import Link from 'next/link';
import { TopNav } from '@/components/top-nav';

export default async function Projects({ params }: { params: { slug: string[] } }) {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-4xl xl:px-0 flex min-h-screen flex-col items-center">
      <TopNav />
      <div className='text-5xl dark:text-white mt-10'>🚧 Work in Progress</div>
    </main>
  )
}
