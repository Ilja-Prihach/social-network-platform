export type PostMedia =
  | { id: string; type: 'image'; src: string; alt?: string }
  | { id: string; type: 'video'; src: string; poster?: string };

export type Post = {
  id: string;
  authorId: string;
  createdAt: string; // ISO date string
  text: string;
  media: PostMedia[];
};
