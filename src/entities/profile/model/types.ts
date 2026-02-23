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
  type: 'image';
  src: string;
  alt?: string;
};

export type ProfilePost = {
  id: string;
  createdAt: string;
  text: string;
  media: ProfilePostMedia[];
  userName: string;
  avatarOwner?: string;
  likesCount?: number;
  likesAvatars?: string[];
  isLiked?: boolean;
};

export type ProfilePostsPage = {
  items: ProfilePost[];
  nextCursorPostId: number | null;
  pageSize: number;
  totalCount: number;
};

export type GetPublicProfilePostsParams = {
  profileId: number;
  endCursorPostId?: number | null;
  pageSize?: number;
};

export type MyProfile = {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  region: string;
  dateOfBirth?: string | null;
  aboutMe: string;
  avatars: ProfileAvatar[];
  createdAt: string;
};

export type UpdateProfileRequest = {
  userName: string;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  region: string;
  dateOfBirth?: string;
  aboutMe: string;
};

export type UploadProfileAvatarResponse = {
  avatars: ProfileAvatar[];
};
