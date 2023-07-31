import Link from 'next/link'
import { TopNav } from '@/components/top-nav'
import { MobileNav } from '@/components/mobile/nav'

export default async function Projects({ params }: { params: { slug: string[] } }) {
  return (
    <main className="pt-20 lg:pt-0 mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-4xl xl:px-0 flex min-h-screen flex-col items-center">
      <TopNav className="lg:flex" />
      <div className="text-5xl dark:text-white mt-10">🚧 Work in Progress</div>
      <MobileNav className="lg:hidden" />
    </main>
  )
}
