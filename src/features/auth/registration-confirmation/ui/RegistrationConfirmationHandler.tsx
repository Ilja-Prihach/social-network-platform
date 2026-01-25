'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { confirmRegistration } from '@/entities/auth/api/authApi';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { isApiError } from '@/shared/api/types';
import type { ApiError } from '@/shared/api/types';
import type { AuthErrorResponse } from '@/entities/auth/api/authApi';

type RegistrationConfirmationHandlerProps = {
  code?: string;
  email?: string;
  redirectTo?: string;
};

export function RegistrationConfirmationHandler({
  code,
  email,
  redirectTo = '/',
}: RegistrationConfirmationHandlerProps) {
  const router = useRouter();
  const hasConfirmedRef = useRef(false);

  useEffect(() => {
    if (!code || hasConfirmedRef.current) return;
    hasConfirmedRef.current = true;

    confirmRegistration({ code })
      .then(() => {
        showModal({
          title: 'Email confirmed',
          description: email
            ? `Your email ${email} has been confirmed.`
            : 'Your email has been confirmed.',
          confirmText: 'OK',
        });
      })
      .catch((err) => {
        let message = 'Unable to confirm email';

        if (isApiError<AuthErrorResponse>(err)) {
          const apiError = err as ApiError<AuthErrorResponse>;
          message = apiError.data?.messages?.[0]?.message || apiError.data?.error || message;
        } else if (err instanceof Error) {
          message = err.message;
        }

        showModal({
          title: 'Error',
          description: message,
          confirmText: 'OK',
        });
      })
      .finally(() => {
        router.replace(redirectTo);
      });
  }, [code, email, redirectTo, router]);

  return null;
}
