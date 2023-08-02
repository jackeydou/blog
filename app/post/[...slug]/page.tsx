import { Metadata, ResolvingMetadata } from 'next';
import { MDX } from '@/components/mdx';
import { getMarkdownFilePath } from '@/src/utils/mdx';
import { TopNav } from '@/components/top-nav';
import { MobileNav } from '@/components/mobile/nav';
import { getFilesFrontMatter } from '@/src/utils/mdx';

interface Props {
  params: { slug: string[] };
}

export async function generateMetadata(
  { params: { slug } }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const frontmatters = await getFilesFrontMatter();
  const frontmatter = frontmatters.find((it) => {
    const parts = it.slug.split('/') ?? [];
    return parts[parts.length - 1] === slug[slug.length - 1];
  });
  const title = frontmatter?.title ?? "Dou's Website";
  const metadata: Metadata = {
    title,
    authors: {
      name: 'Jackey Dou',
    },
    keywords: 'Programming, Frontend, Life',
    generator: 'Next.js',
    themeColor: 'dark',
    description: '',
    viewport: 'width=device-width, initial-scale=1',
    creator: 'jackey.dou',
    icons: '',
    openGraph: {
      type: 'website',
      url: 'https://jackey.libertylab.icu',
      title,
      description: '',
      siteName: "Dou's Website",
    },
    other: {
      email: 'jackey.dou@gmail.com',
      github: 'https://github.com/jackeydou',
      twitter: 'https://twitter.com/L3Lom0',
    },
  };
  return metadata;
}

export default async function Post({ params }: { params: { slug: string[] } }) {
  const { slug } = params;
  const mdPath = getMarkdownFilePath(slug);
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-4xl xl:px-0 flex min-h-screen flex-col items-center">
      <TopNav className="lg:flex" />
      <div className="animate-[fadein-b_1s_ease-in-out]">
        <MDX sourcePath={mdPath} />
      </div>
      <MobileNav className="lg:hidden" />
    </main>
  );
}
