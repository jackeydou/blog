'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { SocialLinks } from '../social-links';
import { clsxm } from '@/src/utils';

export function SideInfo({ className }: { className?: string }) {
  // const [focusingMember, setFocusingMember] = useAtom(focusingMemberSlugAtom)
  const onMouseEnter = useCallback(() => {}, []);
  const onMouseLeave = useCallback(() => {}, []);
  const [tiltEnabled, setTiltEnabled] = useState(true);
  // only enable tilt on non-mobile devices
  useEffect(() => {
    if (/Mobi|Android|iPhone|iPad/i.test(window.navigator.userAgent)) {
      setTiltEnabled(false);
    }
  }, []);

  return (
    <div
      className={clsxm(
        'fixed w-[360px] h-full ml-3 mt-3 justify-center items-center left-0 hidden',
        className,
      )}
    >
      <motion.div
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
        <Tilt
          className={clsxm([
            'not-prose group flex flex-col justify-between rounded-2xl overflow-hidden',
          ])}
          tiltEnable={tiltEnabled}
          perspective={600}
          scale={1.01}
          glareEnable={true}
          glareMaxOpacity={0.5}
          glareColor="#5a5a5a"
          glarePosition="all"
          glareBorderRadius="0"
          tiltMaxAngleX={4}
          tiltMaxAngleY={4}
          onEnter={onMouseEnter}
          onLeave={onMouseLeave}
        >
          <div className="px-8 py-20 flex rounded-2xl border border-slate-800 dark:border-slate-50 flex-col justify-center items-center">
            <img
              className="rounded-full overflow-hidden w-[200px] h-[200px] mb-8"
              src="/images/avatar.jpg"
              alt="avatar"
            />
            <p className="text-lg mb-4 dark:text-white text-slate-900">Jackey @Bytedance</p>
            <p className="text-lg mb-4 dark:text-white text-slate-900">Base in Shanghai, China</p>
            <SocialLinks initialDelay={0.7} />
            <motion.p
              className="text-sm text-slate-500 dark:text-slate-400 mt-3"
              initial={{
                opacity: 0.001,
                transform: 'translateY(20px)',
              }}
              animate={{
                opacity: 1,
                transform: 'translateY(0px)',
              }}
              transition={{
                ease: 'easeInOut',
                duration: 2,
              }}
            >
              © {new Date().getFullYear()} Jackey. All Rights Reserved
            </motion.p>
          </div>
        </Tilt>
      </motion.div>
    </div>
  );
}
