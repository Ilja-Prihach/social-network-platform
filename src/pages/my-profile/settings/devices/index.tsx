import type { Metadata } from 'next';
import { SettingsStubPage } from '../ui/SettingsStubPage';

export const metadata: Metadata = {
  title: 'Devices',
  description: 'Devices settings page',
};

export default function DevicesSettingsPage() {
  return (
    <SettingsStubPage title="Devices" description="This settings section is not implemented yet." />
  );
}
