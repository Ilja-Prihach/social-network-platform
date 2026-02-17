import type { ReactNode } from 'react';
import { SettingsTabsLayout } from './ui/SettingsTabsLayout';

type Props = {
  children: ReactNode;
};

export default function MyProfileSettingsLayout({ children }: Props) {
  return <SettingsTabsLayout>{children}</SettingsTabsLayout>;
}
