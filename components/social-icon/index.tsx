'use client';
import React, { FC, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Tooltip } from '@/components/tooltip';

export const SocialIcon: FC<{
  icon: (props?: React.SVGAttributes<SVGElement>) => React.ReactNode;
  link: string;
  name: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
}> = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip.Provider disableHoverableContent>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>
          <Link href={props.link} className="my-2" key={props.name}>
            <props.icon className="h-5 w-5 text-white transition" />
          </Link>
        </Tooltip.Trigger>
        <AnimatePresence>
          {open && (
            <Tooltip.Portal forceMount>
              <Tooltip.Content asChild side={props.tooltipSide}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  {props.name}
                </motion.div>
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </AnimatePresence>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
