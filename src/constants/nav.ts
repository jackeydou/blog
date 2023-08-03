import { FiBookOpen } from 'react-icons/fi';
import {
  HomeIcon,
  PostsIcon,
  TagIcon,
  DashboardIcon,
  GitHubIcon,
  TwitterIcon,
  MailIcon,
  AtomIcon,
} from '@/components/icons';
import { NavItemType } from '@/src/types/nav';

export const AllNavItems: NavItemType[] = [
  {
    icon: HomeIcon,
    name: 'Home',
    link: '/',
    type: 'side',
  },
  {
    icon: PostsIcon,
    name: 'Posts',
    link: '/post',
    type: 'side',
  },
  {
    icon: TagIcon,
    name: 'Tags',
    link: '/tags',
    type: 'side',
  },
  {
    icon: DashboardIcon,
    name: 'Projects',
    link: '/projects',
    type: 'side',
  },
  {
    icon: FiBookOpen,
    name: 'Books',
    link: '/books',
    type: 'side',
  },
  {
    icon: GitHubIcon,
    name: 'Github',
    link: 'https://github.com/jackeydou',
    type: 'top',
  },
  {
    icon: TwitterIcon,
    name: 'Twitter',
    link: 'https://twitter.com/L3Lom0',
    type: 'top',
  },
  {
    icon: MailIcon,
    name: 'Email',
    link: 'mailto:jackey.dou@gmail.com',
    type: 'top',
  },
  {
    icon: AtomIcon,
    name: 'RSS',
    link: '',
    type: 'top',
  },
];
