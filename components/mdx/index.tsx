import fs from 'fs/promises';
import { compileMDX } from 'next-mdx-remote/rsc';
import dayjs from 'dayjs';
import Link from 'next/link';

export async function MDX({ sourcePath }: { sourcePath: string }) {
  const source = await fs.readFile(sourcePath, 'utf-8');
  const { content, frontmatter } = await compileMDX<{
    title: string;
    date: string;
    tags: string[];
  }>({
    source,
    options: { parseFrontmatter: true },
  });
  return (
    <article className="flex flex-col pt-20 lg:pt-10">
      <h1 className="text-4xl font-bold text-black dark:text-white">{frontmatter.title}</h1>
      <div className="flex items-center">
        <div className="my-3">
          {frontmatter.tags.map((tag) => (
            <>
              <Link
                href={`/tags/${tag}`}
                key={tag}
                className="hover:text-slate dark:hover:text-text-slate-900 mr-3 text-slate-700 hover:border-b-2 dark:text-slate-300"
              >
                {tag}
              </Link>
            </>
          ))}
        </div>
        <p className="my-3 text-gray-500 dark:text-gray-400">
          {dayjs(frontmatter.date).format('dddd, MMM DD, YYYY')}
        </p>
      </div>
      <div className="prose max-w-none px-2 pt-4 dark:prose-invert">{content}</div>
    </article>
  );
}
