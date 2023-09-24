'use client';
import { FC } from 'react';
import Link from 'next/link';
import { ThemeButton } from '@/components/side-nav/theme-btn';
import { SocialIcon } from '@/components/social-icon';
import Logo from '@/data/logo.svg';
import { clsxm } from '@/src/utils';
import { AllNavItems } from '@/src/constants/nav';
import { NavItemType } from '@/src/types/nav';

const NavItems: (NavItemType & { text?: string })[] = [
  {
    text: 'Posts',
    name: 'Posts',
    link: '/post',
    icon: () => <></>,
  },
  {
    text: 'Projects',
    name: 'Projects',
    link: '/projects',
    icon: () => <></>,
  },
  {
    text: 'Tags',
    name: 'Tags',
    link: '/tags',
    icon: () => <></>,
  },
  {
    text: 'Books',
    name: 'Books',
    link: '/books',
    icon: () => <></>,
  },
  ...AllNavItems.filter((it) => it.type === 'top'),
];

export const TopNav: FC<{ className?: string }> = ({ className }) => {
  return (
    <nav className={clsxm('sticky inset-x-0 top-0 hidden h-[50px] w-full', className)}>
      <div className="z-50 flex h-[50px] w-full max-w-screen-xl items-center justify-between">
        <Link href="/">
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Logo />
            </div>
            <span>DOU'S BLOG</span>
          </div>
        </Link>
        <div className="flex items-center">
          {NavItems.map((it) => {
            return (
              <div className="mx-2 inline-block text-slate-700 dark:text-slate-300" key={it.name}>
                {it.text ? (
                  <Link href={it.link}>{it.text}</Link>
                ) : (
                  <SocialIcon icon={it.icon} link={it.link} name={it.name} tooltipSide="bottom" />
                )}
              </div>
            );
          })}
          <ThemeButton className="mx-2" />
        </div>
      </div>
    </nav>
  );
};
