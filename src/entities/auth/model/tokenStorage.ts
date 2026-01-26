const TOKEN_KEY = 'accessToken';

const isBrowser = (): boolean => typeof window !== 'undefined';

export const saveToken = (token: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuth = (): boolean => {
  return Boolean(getToken());
};
