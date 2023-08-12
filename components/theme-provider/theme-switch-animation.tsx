'use client';
import { useAtomValue } from 'jotai';
import { motion } from 'framer-motion';
import { useMemo, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { themeAniPositionAtom } from '@/src/atom/theme';

export const ThemeSwitchAnimation = () => {
  const position = useAtomValue(themeAniPositionAtom);
  const themeContext = useTheme();
  const isDarkMode = useMemo(() => {
    return themeContext.resolvedTheme === 'dark';
  }, [themeContext.resolvedTheme]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <motion.div
      className="w-[4000px] h-[4000px] rounded-full fixed bg-light-bg"
      initial={false}
      animate={{ scale: isDarkMode ? 0 : 1 }}
      exit={{ scale: 0 }}
      transition={{
        duration: 0.5,
      }}
      style={{
        transformOrigin: `${position.x} ${position.y}`,
        left: 'calc(50vw - 2000px)',
        top: 'calc(50vh - 2000px)',
      }}
    ></motion.div>
  );
};
