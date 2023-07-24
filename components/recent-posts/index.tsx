'use client'
import { FC } from 'react'
import { motion } from 'framer-motion'
import { Screen } from '../screen'
import { Wrapper } from '../home-wrapper'
import { BubbleAnimationText } from '../bubble-text'
import { microReboundPreset } from '@/src/constants'
import { PostHeader } from '@/src/types/post'

export const RecentPosts: FC<{
  posts: PostHeader[]
}> = ({ posts }) => {
  return (
    <Screen>
      <Wrapper>
        <motion.div>
          {posts.map((post) => {
            return <p>{post.title}</p>
          })}
        </motion.div>
      </Wrapper>
    </Screen>
  )
}
