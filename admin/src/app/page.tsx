import { redirect } from 'next/navigation';
import { adminDefaultLocale } from '../../intlayer.config';

export default function AdminRootPage() {
  redirect(`/${adminDefaultLocale}/sign-in`);
}
