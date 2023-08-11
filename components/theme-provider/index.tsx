// app/providers.tsx
'use client';

import React from 'react';
import { ThemeProvider as Theme } from 'next-themes';

type ProvidersProps = {
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<ProvidersProps> = (props) => {
  const { children } = props;

  return (
    <Theme attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </Theme>
  );
};
