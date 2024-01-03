'use client';
import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { MobileSideInfo } from '../side-info/mobile';
import { Screen } from '../screen';
import { Wrapper } from '../home-wrapper';
import { BubbleAnimationText } from '../bubble-text';
import { microReboundPreset } from '@/src/constants';
import { ThemeButton } from '../side-nav/theme-btn';

const introText = 'Say Hi👋 from ';
const developerText = '<Developer @Bytedance />';
const intro = [
  {
    text: introText,
    children: (
      <motion.span
        className="text-2xl text-green-600 dark:text-green-400"
        initial={{
          opacity: 0.001,
          transform: 'translateY(10px)',
        }}
        animate={{
          opacity: 1,
          transform: 'translateY(0px)',
          transition: {
            ...microReboundPreset,
            duration: 1,
            delay: introText.length * 0.1,
          },
        }}
      >
        Jackey
      </motion.span>
    ),
  },
  {
    text: developerText,
    children: (
      <motion.span
        className="ml-1 inline-block h-6 w-[2px] bg-slate-100"
        initial={{
          opacity: 0.001,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: (developerText.length + introText.length) * 0.1,
          ease: 'easeInOut',
          repeat: Infinity,
          duration: 1,
        }}
      ></motion.span>
    ),
  },
  {
    text: 'ISTJ / Climber / Spartan / ...',
  },
];

export function Intro() {
  return (
    <Screen>
      <Wrapper>
        <div className="relative flex min-h-screen w-full flex-col justify-center px-4 lg:pl-16 lg:pt-24">
          <MobileSideInfo className="md:hidden" />
          <motion.div
            className="group relative"
            initial={{ opacity: 0.0001, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {intro.map((it, idx) => {
              const delay = 0.1;
              const delayTime = intro.reduce((acc, cur, index) => {
                return acc + (index < idx ? cur.text.length * delay : 0);
              }, 0);
              return (
                <BubbleAnimationText
                  key={it.text + idx}
                  text={it.text}
                  initialDelay={delayTime}
                  delay={delay}
                  spanClassName="text-xl lg:text-2xl"
                  className="justify-center py-1 lg:justify-normal lg:py-4"
                >
                  {it.children}
                </BubbleAnimationText>
              );
            })}
          </motion.div>
          <motion.p
            className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400 lg:text-left"
            initial={{ transform: 'translateY(10px)', opacity: 0.001 }}
            animate={{
              transform: 'translateY(0px)',
              opacity: 1,
              transition: {
                duration: 0.8,
                delay: 2,
              },
            }}
          >
            I'm passionate about open source, coding, and reading excellent books.
          </motion.p>
        </div>
        <motion.div
          className="absolute bottom-2 left-0 right-0 flex flex-col items-center"
          initial={{ opacity: 0.001 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.8,
              delay: 3,
            },
          }}
        >
          <span className="text-sm text-slate-400 dark:text-slate-500">查看更多</span>
          <span className="mt-8 animate-bounce">
            <FiChevronDown className="h-6 w-6 text-slate-950 dark:text-slate-50" />
          </span>
        </motion.div>
        <div className="absolute right-4 top-4 flex h-[50px] w-[50px] items-center justify-center lg:hidden">
          <ThemeButton />
        </div>
      </Wrapper>
    </Screen>
  );
}
