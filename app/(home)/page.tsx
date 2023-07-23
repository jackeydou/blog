'use client'

import { PropsWithChildren } from 'react';
import Image from 'next/image'
import { motion } from 'framer-motion';
import { Screen } from '@/components/screen';
import { BubbleAnimationText } from '@/components/bubble-text';
import { SocialLinks } from '@/components/social-icons';
import { SideNav } from '@/components/side-nav';
import { microReboundPreset } from '@/src/constants';

const introText = "Say Hi👋 from ";
const developerText = '<Developer at="Bytedance" />';
const intro = [{
  text: introText,
  children: (
    <motion.span
      className='text-custom-green text-2xl'
      initial={{
        opacity: 0.001,
        transform: 'translateY(10px)'
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
  )
}, 
{
  text: developerText,
  children:  (
    <motion.span
      className='inline-block w-[2px] h-6 bg-slate-100 ml-1'
      initial={{
        opacity: 0.001,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{ 
        delay: (developerText.length + introText.length) * 0.1,
        ease: "easeInOut",
        repeat: Infinity,
        duration: 1,
      }}
    >
    </motion.span>
  )
}, {
  text: 'INTJ / Climber / Spartan / Avid Reader / .....',
}];

function Wrapper(props: PropsWithChildren<any>) {
  return (
    <div className='w-full ml-[372px] mr-[100px]'>
      {props.children}
    </div>
  )
}

function SideInfo() {
  return (
    <div className='fixed w-[360px] h-full ml-3 mt-3 flex justify-center items-center left-0'>
      <motion.div 
        className='px-8 py-20 flex rounded-lg border border-slate-50 flex-col justify-center items-center'
        initial={{
          opacity: 0.001,
          transform: 'translateX(-30px)',
        }}
        animate={{
          opacity: 1,
          transform: 'translateX(0px)',
        }}
        transition={{ 
          ease: "easeInOut",
          duration: 0.8,
        }}
      >
        <img className='rounded-full overflow-hidden w-[200px] h-[200px] mb-8' src="/images/avatar.png" alt='avatar' />
        <p className='text-lg mb-4'>Jackey @Bytedance</p>
        <p className='text-lg mb-4'>Base in Shanghai, China</p>
        <SocialLinks initialDelay={0.7}/>
        <motion.p 
          className='text-sm text-slate-500 mt-3'
          initial={{
            opacity: 0.001,
            transform: 'translateY(20px)',
          }}
          animate={{
            opacity: 1,
            transform: 'translateY(0px)',
          }}
          transition={{ 
            ease: "easeInOut",
            duration: 2,
          }}
        >
          © {new Date().getFullYear()} Jackey. All Rights Reserved
        </motion.p>
      </motion.div>
    </div>
  );
}

function Intro() {
  return (
    <Screen>
      <div className='flex min-h-screen w-full justify-between'>
        <Wrapper>
          <div className='pl-16 flex justify-center min-h-screen w-full flex-col pt-24'>
            <motion.div
              className="group relative"
              initial={{ opacity: 0.0001, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {
                intro.map((it, idx) =>{
                  const delay = 0.1;
                  const delayTime = intro.reduce((acc, cur, index) => {
                    return acc + (index < idx ? cur.text.length * delay : 0);
                  }, 0);
                  return (
                    <>
                      <BubbleAnimationText text={it.text} initialDelay={delayTime} delay={delay}>
                        {it.children}
                      </BubbleAnimationText>
                    </>
                  );
                })
              }
            </motion.div>
            <motion.p 
              className='text-slate-400 text-sm mt-10'
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
        </Wrapper>
      </div>
    </Screen>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <SideInfo />
      <SideNav />
      <Intro />
    </main>
  )
}
