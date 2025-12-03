// src/stores/reviewsStore.ts
import { create } from 'zustand';
import type { Review } from '../types/review';

export interface Comment {
    id: string;
    reviewId: string;
    bookId: string;
    userId: string;
    userName: string;
    text: string;
    parentCommentId: string | null;
    createdAt: number;
}

interface ReviewsState {
    reviews: Review[];
    comments: Comment[];

    setReviews: (reviews: Review[]) => void;
    addReview: (review: Review) => void;

    addComment: (input: {
        reviewId: string;
        bookId: string;
        userId?: string;
        userName: string;
        text: string;
        parentCommentId?: string | null;
    }) => void;
}

export const useReviewsStore = create<ReviewsState>((set) => ({
    reviews: [],
    comments: [],

    setReviews: (reviews) => set({ reviews }),

    addReview: (review) =>
        set((state) => ({
            reviews: [review, ...state.reviews],
        })),

    addComment: (input) =>
        set((state) => {
            const newComment: Comment = {
                id: `c-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                reviewId: input.reviewId,
                bookId: input.bookId,
                userId: input.userId ?? 'mock-user',
                userName: input.userName,
                text: input.text,
                parentCommentId: input.parentCommentId ?? null,
                createdAt: Date.now(),
            };

            const updatedReviews = state.reviews.map((r) =>
                r.id === input.reviewId
                    ? { ...r, commentsCount: (r.commentsCount ?? 0) + 1 }
                    : r
            );

            return {
                reviews: updatedReviews,
                comments: [newComment, ...state.comments],
            };
        }),
}));
