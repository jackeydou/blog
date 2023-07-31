import * as React from 'react'
import { motion } from 'framer-motion'
import {
  GitHubIcon,
  TwitterIcon,
  MailIcon,
  AtomIcon,
  PostsIcon,
  TagIcon,
  DashboardIcon,
} from '@/components/icons'
import { MenuItem } from '../menu/item'
import { clsxm } from '@/src/utils'

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

const NavItems = [
  {
    icon: PostsIcon,
    name: 'Posts',
    link: '/post',
  },
  {
    icon: DashboardIcon,
    name: 'Projects',
    link: '/projects',
  },
  {
    icon: TagIcon,
    name: 'Tags',
    link: '/tags',
  },
  {
    icon: GitHubIcon,
    name: 'Github',
    link: 'https://github.com/jackeydou',
  },
  {
    icon: TwitterIcon,
    name: 'Twitter',
    link: 'https://twitter.com/L3Lom0',
  },
  {
    icon: MailIcon,
    name: 'Email',
    link: 'mailto:jackey.dou@gmail.com',
  },
  {
    icon: AtomIcon,
    name: 'RSS',
    link: '',
  },
]

export const Navigation = ({ className }: { className?: string }) => (
  <motion.ul variants={variants} className={clsxm('', className)}>
    {NavItems.map((it) => (
      <MenuItem icon={it.icon} link={it.link} name={it.name} key={it.link} />
    ))}
  </motion.ul>
)

const itemIds = [0, 1, 2, 3, 4]
