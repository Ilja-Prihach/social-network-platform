import type { Metadata } from 'next';
import { SettingsStubPage } from '../ui/SettingsStubPage';

export const metadata: Metadata = {
  title: 'Account Management',
  description: 'Account management settings page',
};

export default function AccountManagementSettingsPage() {
  return (
    <SettingsStubPage
      title="Account Management"
      description="This settings section is not implemented yet."
    />
  );
}
