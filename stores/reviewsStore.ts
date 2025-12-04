// src/stores/reviewsStore.ts
import { create } from 'zustand';
import type { Comment } from '../types/comment';
import type { Review } from '../types/review';

export interface ReviewsState {
    reviews: Review[];
    comments: Comment[];

    setReviews: (reviews: Review[]) => void;
    addReview: (review: Review) => void;

    setComments: (comments: Comment[]) => void;
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
    reviews: [],
    comments: [],

    setReviews: (reviews) =>
        set((state) => {
            // mescla por id para não perder o que já está em memória
            const map = new Map<string, Review>();
            state.reviews.forEach((r) => map.set(r.id, r));
            reviews.forEach((r) => map.set(r.id, r));
            return { reviews: Array.from(map.values()) };
        }),

    addReview: (review) =>
        set((state) => ({
            reviews: [review, ...state.reviews],
        })),

    setComments: (comments) => set({ comments }),
}));
