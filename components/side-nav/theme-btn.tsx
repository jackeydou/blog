'use client';
import { useEffect, type MouseEventHandler, useState } from 'react';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useSetAtom } from 'jotai';
import { themeAniPositionAtom } from '@/src/atom/theme';
import { clsxm } from '@/src/utils';

export const ThemeButton = ({ className }: { className?: string }) => {
  const themeContext = useTheme();
  const { resolvedTheme, setTheme } = themeContext;
  const setAniPostion = useSetAtom(themeAniPositionAtom);
  const darkMode = resolvedTheme === 'dark';
  const changeDarkMode: MouseEventHandler<HTMLDivElement> = (evt) => {
    const { clientX, clientY } = evt;
    setAniPostion({
      x: `${(clientX + 2000 - window.innerWidth / 2) / 40}%`,
      y: `${(clientY + 2000 - window.innerHeight / 2) / 40}%`,
    });
    if (darkMode) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <div onClick={changeDarkMode} className={clsxm('', className)}>
      {darkMode ? (
        <FiSun className="h-5 w-5 text-white transition" />
      ) : (
        <FiMoon className="h-5 w-5 text-black transition" />
      )}
    </div>
  );
};
