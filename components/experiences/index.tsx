'use client'
import { FC } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Screen } from '../screen'
import { Wrapper } from '../home-wrapper'
import { BubbleAnimationText } from '../bubble-text'
import { microReboundPreset } from '@/src/constants'

import './index.css'

export const Experiences: FC = () => {
  return (
    <Screen className="px-8">
      <Wrapper>
        <BubbleAnimationText text='Education & '>
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
                delay: 1.1,
              },
            }}
          >
            Experiences
          </motion.span>
        </BubbleAnimationText>
        <div
          className='pt-4'
        >
          <ul className='timeline'>
            <motion.li 
              className='timeline-item px-6 pb-8'
              initial={{
                opacity: 0.001,
                transform: 'translateY(10px)',
              }}
              animate={{
                opacity: 1,
                transform: 'translateY(0px)',
                transition: {
                  ...microReboundPreset,
                  delay: 1.1,
                },
              }}
            >
              <div className='text-slate-200 timeline-t-p text-sm'>2022 - <span className='text-custom-green'>present</span></div>
              <p className='text-xl text-white my-2'>Senior Software Engineer</p>
              <p className='text-xs text-slate-400'>Bytedance - Client Infra - Lynx</p>
            </motion.li>
            <motion.li
              className='timeline-item px-6 pb-8'
              initial={{
                opacity: 0.001,
                transform: 'translateY(10px)',
              }}
              animate={{
                opacity: 1,
                transform: 'translateY(0px)',
                transition: {
                  ...microReboundPreset,
                  delay: 1.3,
                },
              }}
            >
              <div className='text-slate-200 timeline-t text-sm'>2019-2022</div>
              <p className='text-xl text-white my-2'>Senior Frontend Engineer</p>
              <p className='text-xs text-slate-400'>Bytedance - ECommerce</p>
              <p className='text-xl text-white my-2'>Frontend Engineer</p>
              <p className='text-xs text-slate-400'>Bytedance - ECommerce</p>
            </motion.li>
            <motion.li
              className='timeline-item px-6 pb-8'
              initial={{
                opacity: 0.001,
                transform: 'translateY(10px)',
              }}
              animate={{
                opacity: 1,
                transform: 'translateY(0px)',
                transition: {
                  ...microReboundPreset,
                  delay: 1.5,
                },
              }}
            >
              <div className='text-slate-200 timeline-t text-sm'>2015-2019</div>
              <div className='text-xl text-white my-2'>Bachelor Degree of Computer Science</div>
              <div className='text-xs text-slate-400'><Link href="https://zh.wikipedia.org/wiki/%E5%A4%8D%E6%97%A6%E5%A4%A7%E5%AD%A6">Fudan University</Link></div>
            </motion.li>
          </ul>
        </div>
      </Wrapper>
    </Screen>
  )
}
