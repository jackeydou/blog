'use client'
import { FC } from 'react'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import Link from 'next/link'
import { Screen } from '../screen'
import { Wrapper } from '../home-wrapper'
import { BubbleAnimationText } from '../bubble-text'
import { PostHeader } from '@/src/types/post'

export const RecentPosts: FC<{
  posts: PostHeader[]
}> = ({ posts }) => {
  return (
    <Screen className="px-8">
      <Wrapper>
        <BubbleAnimationText text="Posts" />
        <motion.div
          className="mt-6"
          initial={{
            opacity: 0.001,
            transform: 'translateY(30px)',
          }}
          animate={{
            opacity: 1,
            transform: 'translateX(0px)',
          }}
          transition={{
            delay: 0.5,
            ease: 'easeInOut',
            duration: 0.8,
          }}
        >
          {posts.map((post) => {
            return (
              <div key={post.slug} className="py-3">
                <Link href={post.slug}>
                  <span className="text-lg text-slate-300">{post.title}</span>
                  <span className="text-sm text-slate-500 ml-4">
                    {dayjs(post.date).format('YYYY-MM-DD')}
                  </span>
                </Link>
              </div>
            )
          })}
          <div className="text-sm text-slate-500 mt-4 cursor-pointer">查看更多</div>
        </motion.div>
      </Wrapper>
    </Screen>
  )
}
