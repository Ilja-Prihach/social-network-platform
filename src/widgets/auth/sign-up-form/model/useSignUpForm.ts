import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUpMutation } from '@/entities/auth/model/useSignUpMutation';
import { ApiError, isApiError } from '@/shared/api/types';
import { AuthErrorResponse } from '@/entities/auth/api/authApi';
import { showAlert } from '@/shared/ui/Alert/Alert';
import { useDictionary } from 'next-intlayer';
import signUpFormContent from '../sign-up-form.content';

type FormErrors = {
  userName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agree: boolean;
};

type ServerErrorFields = {
  [K in keyof FormErrors]: FormErrors[K] extends string ? K : never;
}[keyof FormErrors];

type FormField = ServerErrorFields;

const initialErrors: FormErrors = {
  userName: '',
  email: '',
  password: '',
  passwordConfirm: '',
  agree: false,
};

export function useSignUpForm() {
  const content = useDictionary(signUpFormContent);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const { mutateAsync, isPending } = useSignUpMutation();
  const router = useRouter();

  const validate = () => {
    const nextErrors: FormErrors = {
      userName: userName ? '' : content.userNameRequired.value,
      email: /\S+@\S+\.\S+/.test(email) ? '' : content.invalidEmail.value,
      password: password.length >= 6 ? '' : content.passwordMin.value,
      passwordConfirm: password === passwordConfirm ? '' : content.passwordMismatch.value,
      agree: !agree,
    };

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  };

  const applyServerErrors = (apiError: ApiError<AuthErrorResponse>) => {
    const messages = apiError.data.messages;
    if (!messages?.length) return;

    setErrors((prev) => {
      const next: FormErrors = { ...prev };

      messages.forEach(({ field, message }) => {
        if (field in next) {
          next[field as FormField] = message;
        }
      });

      return next;
    });
  };

  const getApiErrorMessage = (apiError: ApiError<AuthErrorResponse>) =>
    apiError.data.messages?.[0]?.message || apiError.data.error || 'Registration failed';

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await mutateAsync({
        userName,
        email,
        password,
      });

      router.push('/congratulations');
    } catch (err) {
      if (isApiError<AuthErrorResponse>(err)) {
        applyServerErrors(err);
        showAlert(getApiErrorMessage(err), 'error');
        return;
      }

      const message = err instanceof Error ? err.message : 'Registration failed';
      showAlert(message, 'error');
    }
  };

  return {
    values: {
      userName,
      setUserName,
      email,
      setEmail,
      password,
      setPassword,
      passwordConfirm,
      setPasswordConfirm,
    },
    errors,
    agree,
    setAgree,
    submit,
    isSubmitting: isPending,
  };
}
