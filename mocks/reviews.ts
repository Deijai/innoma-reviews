// src/mocks/reviews.ts
import type { Review } from '../types/review';

export const REVIEWS: Review[] = [
    {
        id: 'rev-1',
        bookId: 'atomic-habits',
        userId: 'user-1',
        userName: 'Você',
        userAvatar: null,
        rating: 5,
        title: 'Mudou minha forma de enxergar hábitos',
        text: 'Aplicando as ideias de forma incremental, consegui finalmente manter uma rotina de leitura diária.',
        containsSpoilers: false,
        likes: 12,
        commentsCount: 2,
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
        id: 'rev-2',
        bookId: 'deep-work',
        userId: 'user-2',
        userName: 'Ana',
        userAvatar: null,
        rating: 4,
        title: 'Ótimo para quem se distrai fácil',
        text: 'Várias ideias boas, mas exige adaptação ao seu contexto de trabalho.',
        containsSpoilers: false,
        likes: 5,
        commentsCount: 1,
        createdAt: Date.now() - 1000 * 60 * 60 * 5,
    },
];
