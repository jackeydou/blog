import type { JSX } from 'react';

export interface NavItemType {
  icon: (props: any) => JSX.Element;
  name: string;
  link: string;
  type?: 'side' | 'top' | 'all';
}
