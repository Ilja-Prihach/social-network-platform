import { gql } from '@apollo/client';
import { createAdminApolloClient, type AdminCredentials } from '@/shared/apollo';

export type UsersListItem = {
  id: number;
  userName: string;
  createdAt: string;
  userBan: {
    reason: string;
    createdAt: string;
  } | null;
};

export type UsersListPagination = {
  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;
};

type GetUsersResponse = {
  getUsers: {
    users: UsersListItem[];
    pagination: UsersListPagination;
  };
};

const GET_USERS_QUERY = gql`
  query GetUsers(
    $pageSize: Int!
    $pageNumber: Int!
    $sortBy: String!
    $sortDirection: SortDirection!
    $searchTerm: String
    $statusFilter: UserBlockStatus!
  ) {
    getUsers(
      pageSize: $pageSize
      pageNumber: $pageNumber
      sortBy: $sortBy
      sortDirection: $sortDirection
      searchTerm: $searchTerm
      statusFilter: $statusFilter
    ) {
      users {
        id
        userName
        createdAt
        userBan {
          reason
          createdAt
        }
      }
      pagination {
        totalCount
        pagesCount
        page
        pageSize
      }
    }
  }
`;

export const getUsersList = async (credentials: AdminCredentials) => {
  const client = createAdminApolloClient(credentials);

  const result = await client.query<GetUsersResponse>({
    query: GET_USERS_QUERY,
    variables: {
      pageSize: 8,
      pageNumber: 1,
      sortBy: 'createdAt',
      sortDirection: 'desc',
      searchTerm: null,
      statusFilter: 'ALL',
    },
    fetchPolicy: 'no-cache',
  });

  if (!result.data) {
    throw new Error('getUsers returned no data');
  }

  return result.data.getUsers;
};
