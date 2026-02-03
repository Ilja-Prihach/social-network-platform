'use client';

import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { useResendVerification } from '@/features/emailVerification/model/useResendVerification';
import { useRecoverPassword } from '@/features/auth/forgot-password/model/useRecoverPassword';

type Variant = 'sign-up' | 'password-recovery';

type Copy = {
  confirmEmailPrefix: string;
  recoveryPrefix: string;
  modalTitle: string;
  ok: string;
  errorTitle: string;
};

type Params = {
  variant: Variant;
  email?: string;
  copy: Copy;
};

const STORAGE_KEY = 'forgotPasswordEmail';

const getLocaleFromParams = (params: ReturnType<typeof useParams>) => {
  const locale = params?.locale;
  if (typeof locale === 'string') return locale;
  if (Array.isArray(locale)) return locale[0];
  return undefined;
};

export const useEmailVerificationResend = ({ variant, email: emailProp, copy }: Params) => {
  const params = useParams();
  const locale = getLocaleFromParams(params);
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(emailProp ?? '');

  const { mutate: resendVerification, isPending: isVerificationPending } = useResendVerification();
  const { mutate: resendRecovery, isPending: isRecoveryPending } = useRecoverPassword();

  const isSignUp = variant === 'sign-up';

  const fallbackEmail = useMemo(() => {
    if (emailProp) return emailProp;

    const queryEmail = searchParams?.get('email') ?? undefined;
    if (queryEmail) return queryEmail;

    if (typeof window === 'undefined') return undefined;
    return window.localStorage.getItem(STORAGE_KEY) ?? undefined;
  }, [emailProp, searchParams]);

  const activeEmail = isSignUp ? email : (fallbackEmail ?? '');
  const isPending = isSignUp ? isVerificationPending : isRecoveryPending;
  const isDisabled = !activeEmail.trim() || isPending;

  const handleResend = () => {
    const nextEmail = activeEmail.trim();

    if (!nextEmail) return;

    const successMessage = isSignUp
      ? `${copy.confirmEmailPrefix} ${nextEmail}`
      : `${copy.recoveryPrefix} ${nextEmail}`;

    const mutationOptions = {
      onSuccess: () => {
        showModal({
          title: copy.modalTitle,
          description: successMessage,
          confirmText: copy.ok,
        });

        if (isSignUp) {
          setEmail('');
        }
      },
      onError: (error: unknown) => {
        showModal({
          title: copy.errorTitle,
          description: (error as Error).message,
          confirmText: copy.ok,
        });
      },
    };

    if (isSignUp) {
      resendVerification(nextEmail, mutationOptions);
    } else {
      resendRecovery({ email: nextEmail, locale }, mutationOptions);
    }
  };

  return {
    email,
    setEmail,
    isSignUp,
    isPending,
    isDisabled,
    handleResend,
  };
};
