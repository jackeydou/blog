import type { FC } from 'react'
import { motion } from 'framer-motion'
import { GitHubIcon, TelegramIcon, TwitterIcon, MailIcon, AtomIcon } from '@/components/icons'
import { microReboundPreset } from '@/src/constants'
import Link from 'next/link'

const socials = [
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
    icon: TelegramIcon,
    name: 'Telegram',
    link: '',
  },
  {
    icon: AtomIcon,
    name: 'RSS',
    link: '',
  },
]

export const SocialLinks: FC<{
  initialDelay?: number
  delay?: number
}> = ({ initialDelay = 0, delay = 0.1 }) => {
  return (
    <div>
      {socials.map((iter, idx) => {
        const SocialSvg = iter.icon
        return (
          <motion.div
            key={idx}
            className="inline-block px-2"
            initial={{
              opacity: 0.001,
              transform: 'translateY(10px)',
            }}
            animate={{
              transform: 'translateY(0px)',
              opacity: 1,
              transition: {
                ...microReboundPreset,
                duration: 0.1,
                delay: idx * delay + initialDelay,
              },
            }}
          >
            <Link
              className="text-sm text-gray-500 transition hover:text-gray-600"
              target="_blank"
              rel="noopener noreferrer"
              href={iter.link}
            >
              <SocialSvg className="h-6 w-6 text-slate-300 transition hover:text-white" />
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
