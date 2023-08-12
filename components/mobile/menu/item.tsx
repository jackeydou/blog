import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export const MenuItem: React.FC<{
  icon: (props?: React.SVGAttributes<SVGElement>) => React.ReactNode;
  name: string;
  link: string;
}> = (props) => {
  return (
    <motion.li
      className="dark:text-white text-slate-50"
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <props.icon />
      <Link href={props.link}>
        <span className="ml-2">{props.name}</span>
      </Link>
    </motion.li>
  );
};
