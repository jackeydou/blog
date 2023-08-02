import { FC } from 'react';
import Link from 'next/link';
import { kebabCase } from '@/src/utils/mdx';

export const Tag: FC<{ text: string }> = ({ text }) => {
  return (
    <Link href={`/tags/${kebabCase(text)}`}>
      <span className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
        {text.split(' ').join('-')}
      </span>
    </Link>
  );
};
