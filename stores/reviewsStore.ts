// src/stores/reviewsStore.ts
import { create } from 'zustand';
import type { Comment } from '../types/comment';
import type { Review } from '../types/review';

export interface ReviewsState {
    reviews: Review[];
    comments: Comment[];

    setReviews: (reviews: Review[]) => void;
    addReview: (review: Review) => void;

    addComment: (input: {
        reviewId: string;
        bookId: string;
        userName: string;
        text: string;
        parentCommentId?: string | null;
    }) => void;
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
    reviews: [],
    comments: [],

    setReviews: (reviews) => set({ reviews }),

    addReview: (review) =>
        set((state) => ({
            reviews: [review, ...state.reviews],
        })),

    addComment: ({ reviewId, bookId, userName, text, parentCommentId }) =>
        set((state) => {
            const newComment: Comment = {
                id: `cmt-${Date.now()}-${state.comments.length + 1}`,
                reviewId,
                bookId,
                userId: 'mock-user',
                userName,
                userAvatar: null,
                text,
                parentCommentId: parentCommentId ?? null,
                createdAt: Date.now(),
            };

            const updatedReviews = state.reviews.map((r) =>
                r.id === reviewId
                    ? {
                        ...r,
                        commentsCount: (r.commentsCount ?? 0) + 1,
                    }
                    : r
            );

            return {
                comments: [newComment, ...state.comments],
                reviews: updatedReviews,
            };
        }),
}));
