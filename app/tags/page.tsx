import Link from 'next/link'
import { TopNav } from '@/components/top-nav'
import { Tag } from '@/components/tag'
import { getTags, kebabCase } from '@/src/utils/mdx'
import { MobileNav } from '@/components/mobile/nav'

export default async function Tags({ params }: { params: { slug: string[] } }) {
  const { slug } = params
  const tags = await getTags()
  const sortedKeys = Object.keys(tags).sort((a, b) => tags[b] - tags[a])
  return (
    <main className="pt-20 lg:pt-0 mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-4xl xl:px-0 flex min-h-screen flex-col items-center">
      <TopNav className="lg:flex" />
      <MobileNav className="lg:hidden" />
      <div className="animate-fadein-b flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="dark:text-white text-3xl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            Tags
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {Object.keys(tags).length === 0 && 'No tags found.'}
          {sortedKeys.map((t) => {
            return (
              <div key={t} className="mt-2 mb-2 mr-5">
                <Tag text={t} />
                <Link
                  href={`/tags/${kebabCase(t)}`}
                  className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                >
                  {` (${tags[t]})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
