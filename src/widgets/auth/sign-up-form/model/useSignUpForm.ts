import { useState } from 'react';
import type { FormEvent } from 'react';
import { useSignUpMutation } from '@/entities/auth/model/useSignUpMutation';
import { ApiError, isApiError } from '@/shared/api/types';
import { AuthErrorResponse } from '@/entities/auth/api/authApi';

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
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const { mutateAsync, isPending } = useSignUpMutation();

  const validate = () => {
    const nextErrors: FormErrors = {
      userName: userName ? '' : 'Username required',
      email: /\S+@\S+\.\S+/.test(email) ? '' : 'Invalid email',
      password: password.length >= 6 ? '' : 'Min 6 chars',
      passwordConfirm: password === passwordConfirm ? '' : 'Passwords do not match',
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

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await mutateAsync({
        login: userName,
        email,
        password,
      });

      console.log('Ура');
    } catch (err) {
      console.log(err);
      if (isApiError<AuthErrorResponse>(err)) {
        applyServerErrors(err);
      }
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
