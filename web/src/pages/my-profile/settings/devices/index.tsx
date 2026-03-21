import type { Metadata } from 'next';
import { DevicesSettingsPage } from './ui/DevicesSettingsPage';

export const metadata: Metadata = {
  title: 'Devices',
  description: 'Devices settings page',
};

export default function DevicesSettingsRoutePage() {
  return <DevicesSettingsPage />;
}
