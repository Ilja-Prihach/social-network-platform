export type ProfileAvatar = {
  url: string;
  width: number;
  height: number;
  fileSize: number;
  createdAt: string;
};

export type PublicProfile = {
  id: number;
  userName: string;
  aboutMe: string;
  avatars: ProfileAvatar[];
  userMetadata: {
    following: number;
    followers: number;
    publications: number;
  };
  hasPaymentSubscription: boolean;
  isFollowing: boolean;
  isFollowedBy: boolean;
};

export type ProfilePostMedia = {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt?: string;
  poster?: string;
};

export type ProfilePost = {
  id: string;
  createdAt: string;
  text: string;
  media: ProfilePostMedia[];
};

export type ProfilePostsPage = {
  items: ProfilePost[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
};

export type GetPublicProfilePostsParams = {
  profileId: number;
  pageNumber: number;
  pageSize?: number;
};
