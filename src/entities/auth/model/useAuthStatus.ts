'use client';

import { useEffect, useState } from 'react';
import { baseApi } from '@/shared/api/baseApi';

type AuthStatus = 'loading' | 'auth' | 'guest';

export const useAuthStatus = () => {
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let active = true;

    baseApi('/api/auth/me')
      .then(() => {
        if (active) setStatus('auth');
      })
      .catch(() => {
        if (active) setStatus('guest');
      });

    return () => {
      active = false;
    };
  }, []);

  return {
    status,
    isAuthenticated: status === 'auth',
    isLoading: status === 'loading',
  };
};
