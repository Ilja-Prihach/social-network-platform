import 'server-only';

export const isProd = process.env.NODE_ENV === 'production';
export const ACCESS_TOKEN_COOKIE_NAME = isProd ? '__Host-access_token' : 'access_token';
