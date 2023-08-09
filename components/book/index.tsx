import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="flex py-4">
      <div className="w-[100px] flex-shrink-0 h-[143px] bg-gray-600">
        <Image src={book.cover} alt={book.book_name} width={100} height={143} />
      </div>
      <div className="px-3">
        <Link href={book.link}>
          <p className="text-lg dark:text-slate-100 mb-3 hover:underline underline-offset-4">
            {book.book_name}
          </p>
        </Link>
        <p className="text-sm dark:text-slate-500 text-ellipsis overflow-hidden max-h-20 line-clamp-4">
          {book.description}
        </p>
        <div className="flex items-center mt-2">
          <div className="flex">{stars.map((it, idx) => it)}</div>
          <span className="ml-2 text-slate-400 text-sm">
            {book.progress >= 100 ? '已读完' : `进度：${book.progress}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
