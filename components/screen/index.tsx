'use client'
import { forwardRef, useRef, PropsWithChildren } from 'react'
import { useInView } from 'framer-motion'
import { clsxm } from '@/src/utils'

export const Screen = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    className?: string
  }>
>((props, ref) => {
  const inViewRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(inViewRef, { once: true })

  return (
    <div
      ref={ref}
      className={clsxm('relative flex h-screen min-h-[900px] w-screen flex-col', props.className)}
    >
      <span ref={inViewRef} />
      {inView && props.children}
    </div>
  )
})

Screen.displayName = 'Screen'
