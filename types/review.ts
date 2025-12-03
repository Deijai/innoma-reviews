// src/types/review.ts

export interface Review {
    id: string;
    bookId: string;
    userId: string;
    userName: string;
    userAvatar?: string | null;

    rating: number; // 0–5
    title: string;
    text: string;
    containsSpoilers: boolean;

    likes: number;
    commentsCount: number;

    createdAt: number; // Date.now() por enquanto
    // futuro: updatedAt, language, isEdited etc.
}
