import { FC } from 'react';
import Link from 'next/link';
import { kebabCase } from '@/src/utils/mdx';
import { IBook } from '@/src/types/book';

export const Book: FC<{ book: IBook }> = ({ book }) => {
  return (
    <Link href={book.link}>
      <div className="flex justify-between py-4">
        <img src={book.cover} className="w-[100px] flex-shrink-0 h-[143px]" />
        <div className="px-3">
          <p className="text-lg dark:text-slate-100 mb-3">{book.book_name}</p>
          <p className="text-sm dark:text-slate-500 text-ellipsis overflow-hidden max-h-20 line-clamp-4">
            {book.description}
          </p>
        </div>
      </div>
    </Link>
  );
};
