import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { slug } from 'github-slugger-typescript';
import { getAllFilesRecursively } from './file';
import { PostHeader } from '../types/post';

const root = process.cwd();

export function formatSlug(slug: string) {
  return slug.replace(/\.(mdx|md)/, '');
}

export function dateSortDesc(a: string, b: string) {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
}

const frontMatterCache: Map<string, PostHeader[]> = new Map();

export async function getFilesFrontMatter(limit?: number): Promise<PostHeader[]> {
  const prefixPaths = path.join(root, 'data', 'blog');
  const allFiles = getAllFilesRecursively(prefixPaths);
  const key = `key_${allFiles.length}`;
  if (frontMatterCache.get(key)) {
    const frontmatter = frontMatterCache.get(key)!;
    return limit ? frontmatter.slice(0, limit) : frontmatter;
  }
  const nonPinnedFrontMatter: PostHeader[] = [];
  const pinnedFrontMatters: PostHeader[] = [];
  allFiles.forEach((file) => {
    // Replace is needed to work on Windows
    const fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, '/');
    // Remove Unexpected File
    if (path.extname(fileName) === '.md' || path.extname(fileName) === '.mdx') {
      const source = fs.readFileSync(file, 'utf8');
      const { data: frontmatter } = matter(source);
      if (frontmatter.pinned) {
        pinnedFrontMatters.push({
          ...frontmatter,
          slug: formatSlug(fileName),
          date: new Date(frontmatter.date ?? Date.now()).toISOString(),
        } as PostHeader);
      } else {
        if (frontmatter.draft !== true) {
          nonPinnedFrontMatter.push({
            ...frontmatter,
            slug: formatSlug(fileName),
            date: new Date(frontmatter.date ?? Date.now()).toISOString(),
          } as PostHeader);
        }
      }
    }
  });
  const sortedNonPinnedMatters = nonPinnedFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date));
  const sortedPinnedMatters = pinnedFrontMatters.sort((a, b) => dateSortDesc(a.date, b.date));
  const finalMatters = [...sortedPinnedMatters, ...sortedNonPinnedMatters];
  frontMatterCache.set(key, finalMatters);
  return limit ? finalMatters.slice(0, limit) : finalMatters;
}

export const kebabCase = (str: string) => slug(str);

export async function getTags() {
  const frontmatter = await getFilesFrontMatter();
  const tagCount: Record<string, number> = {};
  frontmatter.forEach((it) => {
    if (it.tags && it.draft !== true) {
      it.tags.forEach((tag) => {
        const formattedTag = kebabCase(tag);
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1;
        } else {
          tagCount[formattedTag] = 1;
        }
      });
    }
  });
  return tagCount;
}

export function getMarkdownFilePath(slug: string[]) {
  const prefix = path.join(root, 'data', 'blog', ...slug);
  const md = `${prefix}.md`;
  const mdx = `${prefix}.mdx`;
  if (fs.existsSync(md)) {
    return md;
  }
  return mdx;
}
