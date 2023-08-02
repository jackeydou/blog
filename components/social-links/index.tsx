import type { FC } from 'react';
import { motion } from 'framer-motion';
import { microReboundPreset } from '@/src/constants';
import { AllNavItems } from '@/src/constants/nav';
import Link from 'next/link';

const socials = AllNavItems.filter((it) => it.type === 'top');

export const SocialLinks: FC<{
  initialDelay?: number;
  delay?: number;
}> = ({ initialDelay = 0, delay = 0.1 }) => {
  return (
    <div>
      {socials.map((iter, idx) => {
        const SocialSvg = iter.icon;
        return (
          <motion.div
            key={idx}
            className="inline-block px-2"
            initial={{
              opacity: 0.001,
              transform: 'translateY(10px)',
            }}
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
            <Link
              className="text-sm text-gray-500 transition hover:text-gray-600"
              target="_blank"
              rel="noopener noreferrer"
              href={iter.link}
            >
              <SocialSvg className="h-6 w-6 text-slate-300 transition hover:text-white" />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};
