'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useCycle } from 'framer-motion';
import { useDimensions } from './use-dimensions';
import { MenuToggle } from '../menu/toggle';
import { Navigation } from './nav';
import './index.css';
import { clsxm } from '@/src/utils';

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
};

export const MobileNav = ({ className }: { className?: string }) => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const [hideNav, toggleHideNav] = useState(false);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const timer = useRef<any>(null);
  useEffect(() => {
    if (isOpen) {
      toggleHideNav(true);
    } else {
      timer.current = setTimeout(() => {
        toggleHideNav(isOpen);
      }, 500);
    }
    return () => clearTimeout(timer.current);
  }, [isOpen]);

  return (
    <motion.nav
      className={clsxm('mobile-nav absolute bottom-0 left-0 top-0', className)}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      custom={height}
      ref={containerRef}
    >
      <motion.div
        className="mobile-nav-background bg-gray-200 dark:bg-gray-800"
        variants={sidebar}
      />
      <Navigation className={hideNav ? 'block' : 'hidden'} />
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
};
