import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { adminGraphqlUrl } from '@/shared/config/graphql';

export type AdminCredentials = {
  email: string;
  password: string;
};

const encodeBase64 = (value: string) => {
  if (typeof globalThis.btoa === 'function') {
    return globalThis.btoa(value);
  }
  return Buffer.from(value, 'utf-8').toString('base64');
};

const getAuthorizationHeader = (credentials?: AdminCredentials) => {
  if (!credentials) {
    return undefined;
  }

  return `Basic ${encodeBase64(`${credentials.email}:${credentials.password}`)}`;
};

export const createAdminApolloClient = (credentials?: AdminCredentials) => {
  const authorization = getAuthorizationHeader(credentials);

  return new ApolloClient({
    link: new HttpLink({
      uri: adminGraphqlUrl,
      headers: authorization
        ? {
            Authorization: authorization,
          }
        : undefined,
    }),
    cache: new InMemoryCache(),
  });
};
