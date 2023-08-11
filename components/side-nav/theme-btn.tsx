'use client';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon } from 'react-icons/fi';
import { clsxm } from '@/src/utils';

export const ThemeButton = ({ className }: { className?: string }) => {
  const themeContext = useTheme();
  const { resolvedTheme, setTheme } = themeContext;
  const darkMode = resolvedTheme === 'dark';
  const changeDarkMode = () => {
    if (darkMode) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

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
