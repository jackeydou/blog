'use client'
import { FC } from 'react'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import Link from 'next/link'
import { PostHeader } from '@/src/types/post'
import { clsxm } from '@/src/utils'

export const PostList: FC<{
  posts: PostHeader[];
  delay?: number;
  className?: string;
}> = ({ posts, className, delay = 0.8 }) => {
  return (
    <motion.div
      className={clsxm('', className)}
      initial={{
        opacity: 0.001,
        transform: 'translateY(30px)',
      }}
      animate={{
        opacity: 1,
        transform: 'translateX(0px)',
      }}
      transition={{
        delay,
        ease: 'easeInOut',
        duration: 0.8,
      }}
    >
      {posts.map((post) => {
        return (
          <div key={post.slug} className="py-3">
            <Link href={`/post/${post.slug}`}>
              <span className="text-lg text-slate-300">{post.title}</span>
              <span className="text-sm text-slate-500 ml-4">
                {dayjs(post.date).format('YYYY-MM-DD')}
              </span>
            </Link>
          </div>
        )
      })}
    </motion.div>
  )
}