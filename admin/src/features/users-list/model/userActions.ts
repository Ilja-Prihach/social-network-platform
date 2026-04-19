import { gql } from '@apollo/client';
import { createAdminApolloClient, type AdminCredentials } from '@/shared/apollo';

const BAN_USER_MUTATION = gql`
  mutation BanUser($userId: Int!, $banReason: String!) {
    banUser(userId: $userId, banReason: $banReason)
  }
`;

const UNBAN_USER_MUTATION = gql`
  mutation UnbanUser($userId: Int!) {
    unbanUser(userId: $userId)
  }
`;

const REMOVE_USER_MUTATION = gql`
  mutation RemoveUser($userId: Int!) {
    removeUser(userId: $userId)
  }
`;

type MutationResult<TField extends string> = Record<TField, boolean>;

export const banUser = async (
  credentials: AdminCredentials,
  params: { userId: number; banReason: string },
) => {
  const client = createAdminApolloClient(credentials);
  const result = await client.mutate<MutationResult<'banUser'>>({
    mutation: BAN_USER_MUTATION,
    variables: params,
  });

  if (!result.data?.banUser) {
    throw new Error('Failed to ban user');
  }
};

export const unbanUser = async (credentials: AdminCredentials, params: { userId: number }) => {
  const client = createAdminApolloClient(credentials);
  const result = await client.mutate<MutationResult<'unbanUser'>>({
    mutation: UNBAN_USER_MUTATION,
    variables: params,
  });

  if (!result.data?.unbanUser) {
    throw new Error('Failed to unban user');
  }
};

export const removeUser = async (credentials: AdminCredentials, params: { userId: number }) => {
  const client = createAdminApolloClient(credentials);
  const result = await client.mutate<MutationResult<'removeUser'>>({
    mutation: REMOVE_USER_MUTATION,
    variables: params,
  });

  if (!result.data?.removeUser) {
    throw new Error('Failed to delete user');
  }
};
