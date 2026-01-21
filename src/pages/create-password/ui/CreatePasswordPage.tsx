import { Suspense } from 'react';
import { CreatePasswordWidget } from '@/widgets/auth/createPassword/ui/createPassword';

export function CreatePasswordPage() {
  return (
    <Suspense fallback={<div />}>
      <CreatePasswordWidget />
    </Suspense>
  );
}
