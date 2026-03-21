import type { Metadata } from 'next';
import { MyPaymentsSettingsPage } from './ui/MyPaymentsSettingsPage';

export const metadata: Metadata = {
  title: 'My Payments',
  description: 'Payments settings page',
};

export default function MyPaymentsSettingsRoutePage() {
  return <MyPaymentsSettingsPage />;
}
