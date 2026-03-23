const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiBaseUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

const normalizedApiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;

export const adminGraphqlUrl = `${normalizedApiBaseUrl}/api/v1/graphql`;
