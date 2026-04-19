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

export type GetUsersListParams = {
  pageNumber: number;
  pageSize?: number;
  searchTerm?: string | null;
  statusFilter?: 'ALL' | 'BLOCKED' | 'UNBLOCKED';
  sortBy?: 'createdAt' | 'userName';
  sortDirection?: 'asc' | 'desc';
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

export const getUsersList = async (
  credentials: AdminCredentials,
  {
    pageNumber,
    pageSize = 8,
    searchTerm = null,
    statusFilter = 'ALL',
    sortBy = 'createdAt',
    sortDirection = 'desc',
  }: GetUsersListParams,
) => {
  const client = createAdminApolloClient(credentials);

  const result = await client.query<GetUsersResponse>({
    query: GET_USERS_QUERY,
    variables: {
      pageSize,
      pageNumber,
      sortBy,
      sortDirection,
      searchTerm,
      statusFilter,
    },
    fetchPolicy: 'no-cache',
  });

  if (!result.data) {
    throw new Error('getUsers returned no data');
  }

  return result.data.getUsers;
};
