import { gql } from '@apollo/client';
import { createAdminApolloClient } from '@/shared/apollo';

export type LoginAdminInput = {
  email: string;
  password: string;
};

type LoginAdminResponse = {
  loginAdmin: {
    logged: boolean;
  };
};

const LOGIN_ADMIN_QUERY = gql`
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      logged
    }
  }
`;

export const loginAdmin = async ({ email, password }: LoginAdminInput) => {
  const client = createAdminApolloClient();

  const result = await client.mutate<LoginAdminResponse>({
    mutation: LOGIN_ADMIN_QUERY,
    variables: {
      email,
      password,
    },
  });

  if (!result.data) {
    throw new Error('loginAdmin returned no data');
  }

  return result.data.loginAdmin;
};
