import type { Metadata } from 'next';
import { SettingsStubPage } from '../ui/SettingsStubPage';

export const metadata: Metadata = {
  title: 'My Payments',
  description: 'Payments settings page',
};

export default function MyPaymentsSettingsPage() {
  return (
    <SettingsStubPage
      title="My payments"
      description="This settings section is not implemented yet."
    />
  );
}
