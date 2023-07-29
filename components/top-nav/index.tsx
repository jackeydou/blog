'use client'
import { FC } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { microReboundPreset } from '@/src/constants'
import { GitHubIcon, TwitterIcon, MailIcon, AtomIcon } from '@/components/icons'
import { SocialIcon } from '@/components/social-icon'
import Logo from '@/data/logo.svg'

const NavItems = [
  {
    text: "Posts",
    link: "/post",
  },
  {
    text: "Projects",
    link: "/projects",
  },
  {
    text: "Tags",
    link: "/tags",
  },
  {
    icon: GitHubIcon,
    name: 'Github',
    link: 'https://github.com/jackeydou',
  }, {
    icon: TwitterIcon,
    name: 'Twitter',
    link: 'https://twitter.com/L3Lom0',
  }, {
    icon: MailIcon,
    name: 'Email',
    link: 'mailto:jackey.dou@gmail.com',
  }, 
  {
    icon: AtomIcon,
    name: 'RSS',
    link: "",
  },
]


export const TopNav: FC<{}> = () => {
  return (
    <motion.div
      className="w-full h-[50px] flex justify-between items-center"
      initial={{
        opacity: 0.001,
        transform: 'translateY(-20px)',
      }}
      animate={{
        transform: 'translateY(0px)',
        opacity: 1,
        transition: {
          ...microReboundPreset,
          duration: 0.8,
          delay: 0,
        },
      }}
    >
      <Link href="/">
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Logo />
          </div>
        </div>
      </Link>
      <div className='flex items-center'>
        {NavItems.map((it) => {
          return (
            <div className="mx-2 text-slate-300 inline-block" key={it.name}>
              {
                it.icon ? 
                  <SocialIcon icon={it.icon} link={it.link} name={it.name} tooltipSide="bottom" /> : 
                  <Link href={it.link}>
                    {it.text}
                  </Link>
              }
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
