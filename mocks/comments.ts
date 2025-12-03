// src/mocks/comments.ts
import type { Comment } from '../types/comment';

export const COMMENTS: Comment[] = [
    {
        id: 'c-1',
        reviewId: 'rev-1',
        userId: 'user-2',
        userName: 'Ana',
        userAvatar: null,
        text: 'Concordo demais, principalmente com a parte de identidade.',
        parentCommentId: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 1,
    },
    {
        id: 'c-2',
        reviewId: 'rev-1',
        userId: 'user-1',
        userName: 'Você',
        userAvatar: null,
        text: 'Sim! Isso me ajudou a pensar em quem quero ser, não só no que quero fazer.',
        parentCommentId: 'c-1',
        createdAt: Date.now() - 1000 * 60 * 30,
    },
];
