import * as React from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen } from 'react-icons/fi';
import { PostsIcon, TagIcon, DashboardIcon } from '@/components/icons';
import { MenuItem } from '../menu/item';
import { clsxm } from '@/src/utils';
import { AllNavItems } from '@/src/constants/nav';

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

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
    text: 'Books',
    name: 'Books',
    link: '/books',
    icon: FiBookOpen,
  },
  ...AllNavItems.filter((it) => it.type === 'top'),
];

export const Navigation = ({ className }: { className?: string }) => (
  <motion.ul variants={variants} className={clsxm('', className)}>
    {NavItems.map((it) => (
      <MenuItem icon={it.icon} link={it.link} name={it.name} key={it.link} />
    ))}
  </motion.ul>
);

const itemIds = [0, 1, 2, 3, 4];
