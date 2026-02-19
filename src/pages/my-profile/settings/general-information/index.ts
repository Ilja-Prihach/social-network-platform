import type { Metadata } from 'next';
import { MyProfileSettingsPage } from './ui/MyProfileSettingsPage';

export const metadata: Metadata = {
  title: 'General Information',
  description: 'General information settings page',
};

export { MyProfileSettingsPage as default };
