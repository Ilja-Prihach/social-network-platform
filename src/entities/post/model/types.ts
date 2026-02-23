export type PostMedia = { id: string; type: 'image'; src: string; alt?: string };

export type Post = {
  id: string;
  authorId: string;
  createdAt: string; // ISO date string
  text: string;
  media: PostMedia[];
};

export type PostViewerPost = {
  id: string;
  createdAt: string;
  text: string;
  userName: string;
  avatarOwner?: string;
  media: Array<{ id: string; type: 'image'; src: string; alt?: string }>;
  likesCount?: number;
  likesAvatars?: string[];
  isLiked?: boolean;
};
