'use client'
import { FC, PropsWithChildren } from 'react'
import { motion } from 'framer-motion'
import { microReboundPreset } from '@/src/constants'
import { clsxm } from '@/src/utils'

export const BubbleAnimationText: FC<
  PropsWithChildren<{
    text: string
    delay?: number
    initialDelay?: number
    visible?: boolean
    spanClassName?: string
    className?: string
  }>
> = ({
  text,
  delay = 0.1,
  initialDelay = 0,
  visible = true,
  children,
  spanClassName,
  className,
}) => {
  if (!visible) {
    return <div />
  }
  return (
    <div className={clsxm('flex items-center', className)}>
      {Array.from(text).map((it, idx) => {
        return (
          <motion.span
            key={idx}
            className={clsxm(
              'inline-block whitespace-pre text-white text-2xl leading-loose',
              spanClassName
            )}
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
