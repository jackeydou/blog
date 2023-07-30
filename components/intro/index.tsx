'use client'
import { motion } from 'framer-motion'
import { MobileSideInfo } from '../side-info/mobile'
import { Screen } from '../screen'
import { Wrapper } from '../home-wrapper'
import { BubbleAnimationText } from '../bubble-text'
import { microReboundPreset } from '@/src/constants'
import { DownArrowIcon } from '../icons'

const introText = 'Say Hi👋 from '
const developerText = '<Developer at="Bytedance" />'
const intro = [
  {
    text: introText,
    children: (
      <motion.span
        className="text-custom-green text-2xl"
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
        className="inline-block w-[2px] h-6 bg-slate-100 ml-1"
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
    text: 'INTJ / Climber / Spartan / ...',
  },
]

export function Intro() {
  return (
    <Screen>
      <Wrapper>
        <div className="relative px-4 lg:pl-16 flex justify-center min-h-screen w-full flex-col lg:pt-24">
          <MobileSideInfo className='md:hidden' />
          <motion.div
            className="group relative"
            initial={{ opacity: 0.0001, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {intro.map((it, idx) => {
              const delay = 0.1
              const delayTime = intro.reduce((acc, cur, index) => {
                return acc + (index < idx ? cur.text.length * delay : 0)
              }, 0)
              return (
                <BubbleAnimationText 
                  key={it.text + idx}
                  text={it.text}
                  initialDelay={delayTime}
                  delay={delay}
                  spanClassName='text-xl lg:text-2xl'
                  className='justify-center lg:justify-normal'
                >
                  {it.children}
                </BubbleAnimationText>
              )
            })}
          </motion.div>
          <motion.p
            className="text-slate-400 text-sm mt-10 text-center lg:text-left"
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
          className="flex absolute bottom-2 left-0 right-0 items-center flex-col"
          initial={{ opacity: 0.001 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.8,
              delay: 3,
            },
          }}
        >
          <span className="text-sm text-slate-500">查看更多</span>
          <span className="mt-8 animate-bounce">
            <DownArrowIcon />
          </span>
        </motion.div>
      </Wrapper>
    </Screen>
  )
}
