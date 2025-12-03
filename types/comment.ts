// src/types/comment.ts

export interface Comment {
    id: string;

    reviewId: string; // a qual review pertence
    bookId: string;   // redundante, mas útil pra filtros

    userId?: string;
    userName: string;
    userAvatar?: string | null;

    text: string;

    parentCommentId?: string | null; // null = comentário raiz

    createdAt: number; // Date.now()
}
