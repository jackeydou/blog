import '../../globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeSwitchAnimation } from '@/components/theme-provider/theme-switch-animation';

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
