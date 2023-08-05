import { FC } from 'react';
import Link from 'next/link';
import { FiStar } from 'react-icons/fi';
import { clsxm } from '@/src/utils';
import { IBook } from '@/src/types/book';

export const Book: FC<{ book: IBook }> = ({ book }) => {
  const stars = [1, 2, 3, 4, 5].map((it) => (
    <FiStar
      key={it}
      className={clsxm(
        'h-3 w-3 transition',
        it <= book.score ? 'text-yellow-400' : 'text-slate-400',
      )}
    />
  ));
  return (
    <div className="flex justify-between py-4">
      <img src={book.cover} className="w-[100px] flex-shrink-0 h-[143px]" />
      <div className="px-3">
        <Link href={book.link}>
          <p className="text-lg dark:text-slate-100 mb-3 hover:underline underline-offset-4">
            {book.book_name}
          </p>
        </Link>
        <p className="text-sm dark:text-slate-500 text-ellipsis overflow-hidden max-h-20 line-clamp-4">
          {book.description}
        </p>
        <div className="flex mt-2">{stars.map((it, idx) => it)}</div>
      </div>
    </div>
  );
};
