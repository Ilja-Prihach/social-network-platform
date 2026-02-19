import type { Metadata } from 'next';
import { MyProfileSettingsPage } from './general-information/ui/MyProfileSettingsPage';

export const metadata: Metadata = {
  title: 'Profile Settings',
  description: 'General information settings layout',
};

export { MyProfileSettingsPage as default };
