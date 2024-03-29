'use client';
import { FC } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Screen } from '../screen';
import { Wrapper } from '../home-wrapper';
import { BubbleAnimationText } from '../bubble-text';
import { microReboundPreset } from '@/src/constants';

import './index.css';

export const Experiences: FC = () => {
  return (
    <Screen className="px-8">
      <Wrapper>
        <BubbleAnimationText text="Education & ">
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
                delay: 1.1,
              },
            }}
          >
            Experiences
          </motion.span>
        </BubbleAnimationText>
        <div className="pt-4">
          <ul className="timeline">
            <motion.li
              className="timeline-item px-6 pb-8"
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
              <div className="timeline-t-p text-sm text-slate-800 dark:text-slate-200">
                2023.09 - <span className="text-green-600 dark:text-green-400">present</span>
              </div>
              <p className="my-2 text-xl text-slate-900 dark:text-white">
                Senior Software Engineer
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">TikTok</p>
            </motion.li>
            <motion.li
              className="timeline-item px-6 pb-8"
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
              <div className="timeline-t text-sm text-slate-800 dark:text-slate-200">
                2019.07 - 2023.08
              </div>
              <p className="my-2 text-xl text-slate-900 dark:text-white">
                Senior Software Engineer
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Bytedance - Client Infra - Cross Platform
              </p>
              <p className="my-2 text-xl text-slate-900 dark:text-white">
                Senior Frontend Engineer
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Bytedance - ECommerce</p>
              <p className="my-2 text-xl text-slate-900 dark:text-white">Frontend Engineer</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Bytedance - ECommerce</p>
            </motion.li>
            <motion.li
              className="timeline-item px-6 pb-8"
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
              <div className="timeline-t text-sm text-slate-800 dark:text-slate-200">
                2018.11 - 2019.06
              </div>
              <p className="my-2 text-xl text-slate-900 dark:text-white">
                Frontend Engineer(Intern)
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Bytedance - ECommerce</p>
            </motion.li>
            <motion.li
              className="timeline-item px-6 pb-8"
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
              <div className="timeline-t text-sm text-slate-800 dark:text-slate-200">
                2015 - 2019
              </div>
              <div className="my-2 text-xl text-slate-900 dark:text-white">
                Bachelor Degree of Computer Science
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <Link href="https://zh.wikipedia.org/wiki/%E5%A4%8D%E6%97%A6%E5%A4%A7%E5%AD%A6">
                  Fudan University
                </Link>
              </div>
            </motion.li>
          </ul>
        </div>
      </Wrapper>
    </Screen>
  );
};
