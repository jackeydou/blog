import './globals.css';
import { ThemeSwitchAnimation } from '@/components/theme-provider/theme-switch-animation';
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ThemeSwitchAnimation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
