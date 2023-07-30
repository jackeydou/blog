'use client'
import { FC } from 'react'

import { motion } from 'framer-motion'
import { microReboundPreset } from '@/src/constants'
import { HomeIcon, PostsIcon, TagIcon, DashboardIcon } from '@/components/icons'
import { SocialIcon } from '@/components/social-icon';
import { clsxm } from '@/src/utils'


const NavItems = [
  {
    icon: HomeIcon,
    name: 'Home',
    link: '/',
  },
  {
    icon: PostsIcon,
    name: 'Posts',
    link: '/post',
  },
  {
    icon: TagIcon,
    name: 'Tags',
    link: '/tags',
  },
  {
    icon: DashboardIcon,
    name: 'Projects',
    link: '/projects',
  },
]

export const SideNav: FC<{className?: string}> = ({className}) => {
  return (
    <motion.div
      className={clsxm("fixed h-screen w-[100px] right-0 flex-col justify-center items-center hidden", className)}
      initial={{
        opacity: 0.001,
        transform: 'translateX(30px)',
      }}
      animate={{
        transform: 'translateX(0px)',
        opacity: 1,
        transition: {
          ...microReboundPreset,
          duration: 0.8,
          delay: 0,
        },
      }}
    >
      <div className="border border-slate-100 w-9 flex flex-col items-center rounded-full py-3">
        {NavItems.map((it) => {
          return (
            <SocialIcon key={it.name} icon={it.icon} name={it.name} link={it.link} tooltipSide='left'/>
          )
        })}
      </div>
    </motion.div>
  )
}
