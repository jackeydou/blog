'use client';
import { motion } from 'framer-motion';
import { SocialLinks } from '../social-links';
import { clsxm } from '@/src/utils';

export function MobileSideInfo({ className }: { className?: string }) {
  return (
    <div className={clsxm('w-full justify-center items-center flex', className)}>
      <motion.div
        className="flex flex-col justify-center items-center pb-4"
        initial={{
          opacity: 0.001,
          transform: 'translateX(-30px)',
        }}
        animate={{
          opacity: 1,
          transform: 'translateX(0px)',
        }}
        transition={{
          ease: 'easeInOut',
          duration: 0.8,
        }}
      >
        <img
          className="rounded-full overflow-hidden w-[200px] h-[200px] mb-8"
          src="/images/avatar.jpg"
          alt="avatar"
        />
        <SocialLinks initialDelay={0.7} />
      </motion.div>
    </div>
  );
}
