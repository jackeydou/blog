'use client'
import { useRef } from 'react'
import { motion, sync, useCycle } from 'framer-motion'
import { useDimensions } from './use-dimensions'
import { MenuToggle } from '../menu/toggle'
import { Navigation } from './nav'
import './index.css'
import { clsxm } from '@/src/utils'

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: 'circle(25px at 40px 40px)',
    transition: {
      delay: 0.5,
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
}

export const MobileNav = ({ className }: { className?: string }) => {
  const [isOpen, toggleOpen] = useCycle(false, true)
  const containerRef = useRef(null)
  const { height } = useDimensions(containerRef)

  return (
    <motion.nav
      className={clsxm('absolute top-0 left-0 bottom-0 mobile-nav', className)}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      custom={height}
      ref={containerRef}
    >
      <motion.div className="mobile-nav-background bg-dark-bg" variants={sidebar} />
      <Navigation className={isOpen ? 'block' : 'hidden'} />
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  )
}
