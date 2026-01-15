import type { Post } from '../model/types';

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const mockPosts: Post[] = [
  {
    id: 'mock-post-1',
    authorId: 'mock-user-1',
    createdAt: minutesAgo(22),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    media: [
      { id: 'p1-1', type: 'image', src: '/mock/Post1.jpg' },
      { id: 'p1-2', type: 'image', src: '/mock/Post2.jpg' },
      { id: 'p1-3', type: 'image', src: '/mock/Post3.jpg' },
    ],
  },
  {
    id: 'mock-post-2',
    authorId: 'mock-user-2',
    createdAt: minutesAgo(22),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    media: [{ id: 'p2-1', type: 'image', src: '/mock/Post2.jpg' }],
  },
  {
    id: 'mock-post-3',
    authorId: 'mock-user-3',
    createdAt: minutesAgo(22),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    media: [{ id: 'p3-1', type: 'image', src: '/mock/Post3.jpg' }],
  },
  {
    id: 'mock-post-4',
    authorId: 'mock-user-4',
    createdAt: minutesAgo(22),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    media: [{ id: 'p4-1', type: 'image', src: '/mock/Post4.jpg' }],
  },
];
