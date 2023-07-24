'use client'
import { FC, PropsWithChildren } from 'react'
import { motion } from 'framer-motion'
import { microReboundPreset } from '@/src/constants'

export const BubbleAnimationText: FC<
  PropsWithChildren<{
    text: string
    delay?: number
    initialDelay?: number
    visible?: boolean
  }>
> = ({ text, delay = 0.1, initialDelay = 0, visible = true, children }) => {
  if (!visible) {
    return <div />
  }
  return (
    <div className="flex items-center">
      {Array.from(text).map((it, idx) => {
        return (
          <motion.span
            key={idx}
            className="inline-block whitespace-pre text-white text-2xl leading-loose"
            initial={{ transform: 'translateY(10px)', opacity: 0.001 }}
            animate={{
              transform: 'translateY(0px)',
              opacity: 1,
              transition: {
                ...microReboundPreset,
                duration: 0.1,
                delay: idx * delay + initialDelay,
              },
            }}
          >
            {it}
          </motion.span>
        )
      })}
      <div>{children}</div>
    </div>
  )
}
