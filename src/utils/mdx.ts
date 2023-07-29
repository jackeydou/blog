import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { getAllFilesRecursively } from './file'
import { PostHeader } from '../types/post'

const root = process.cwd()

export function formatSlug(slug: string) {
  return slug.replace(/\.(mdx|md)/, '')
}

export function dateSortDesc(a: string, b: string) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export async function getFilesFrontMatter(folder: string, limit?: number) {
  const prefixPaths = path.join(root, 'data', folder)
  const allFiles = getAllFilesRecursively(prefixPaths)

  const allFrontMatter: PostHeader[] = []

  allFiles.forEach((file) => {
    // Replace is needed to work on Windows
    const fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, '/')
    // Remove Unexpected File
    if (path.extname(fileName) === '.md' || path.extname(fileName) === '.mdx') {
      const source = fs.readFileSync(file, 'utf8')
      const { data: frontmatter } = matter(source)
      if (frontmatter.draft !== true) {
        allFrontMatter.push({
          ...frontmatter,
          slug: formatSlug(fileName),
          date: new Date(frontmatter.date).toISOString(),
        } as PostHeader)
      }
    }
  })
  const sortedMatter = allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date))
  return limit ? sortedMatter.slice(0, limit) : sortedMatter
}

export function getMarkdownFilePath(slug: string[]) {
  const prefix = path.join(root, 'data', 'blog', ...slug)
  const md = `${prefix}.md`
  const mdx = `${prefix}.mdx`
  if (fs.existsSync(md)) {
    return md
  }
  return mdx
}