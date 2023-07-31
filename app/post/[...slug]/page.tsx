import { MDX } from '@/components/mdx'
import { getMarkdownFilePath } from '@/src/utils/mdx'
import { TopNav } from '@/components/top-nav'

export default async function Post({ params }: { params: { slug: string[] } }) {
  const { slug } = params
  const mdPath = getMarkdownFilePath(slug)
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-4xl xl:px-0 flex min-h-screen flex-col items-center">
      <TopNav />
      <div className="animate-[fadein-b_1s_ease-in-out]">
        <MDX sourcePath={mdPath} />
      </div>
    </main>
  )
}
