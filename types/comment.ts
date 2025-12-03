// src/types/comment.ts

export interface Comment {
    id: string;
    reviewId: string;
    userId: string;
    userName: string;
    userAvatar?: string | null;

    text: string;
    parentCommentId?: string | null; // undefined/null = comentário raiz

    createdAt: number; // Date.now()
}
