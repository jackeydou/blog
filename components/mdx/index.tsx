import fs from 'fs/promises'
import { compileMDX } from 'next-mdx-remote/rsc'
import dayjs from 'dayjs';
import Link from 'next/link';

export async function MDX({sourcePath}: { sourcePath: string }) {
  const source = await fs.readFile(sourcePath, 'utf-8');  
  const { content, frontmatter } = await compileMDX<{ 
    title: string;
    date: string;
    tags: string[];
  }>({
    source,
    options: { parseFrontmatter: true },
  })
  return (
    <article className='w-full flex flex-col pt-10'>
      <h1 className='text-4xl text-gray-900 dark:text-gray-100'>{frontmatter.title}</h1>
      <p className='text-gray-500 dark:text-gray-400 my-3'>{dayjs(frontmatter.date).format("dddd, MMM DD, YYYY")}</p>
      <div className='pb-4 border-b border-slate-400'>
        {
          frontmatter.tags.map(tag => (
            <Link href={`/tag/${tag}`} key={tag} className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'>
              {tag}
            </Link>
          ))
        }
      </div>
      <div className="prose dark:prose-invert max-w-none pt-4 px-2">
        {content}
      </div>
    </article>
  )
}
