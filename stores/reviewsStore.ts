// stores/reviewsStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Review = {
    id: string;
    bookId: string;
    userName: string;
    rating: number;
    title: string;
    body: string;
    hasSpoilers: boolean;
    createdAt: number;
    comments: Comment[];
};

export type Comment = {
    id: string;
    reviewId: string;
    bookId: string;
    userName: string;
    text: string;
    createdAt: number;
};

type ReviewsState = {
    reviews: Review[];
    addReview: (input: {
        bookId: string;
        userName: string;
        rating: number;
        title: string;
        body: string;
        hasSpoilers: boolean;
    }) => string;
    addComment: (input: {
        reviewId: string;
        bookId: string;
        userName: string;
        text: string;
    }) => void;
    resetReviews: () => void;
};

export const useReviewsStore = create<ReviewsState>()(
    persist(
        (set, get) => ({
            reviews: [],

            addReview: ({ bookId, userName, rating, title, body, hasSpoilers }) => {
                const id = String(Date.now());
                const createdAt = Date.now();

                const newReview: Review = {
                    id,
                    bookId,
                    userName,
                    rating,
                    title: title.trim(),
                    body: body.trim(),
                    hasSpoilers,
                    createdAt,
                    comments: [],
                };

                set((state) => ({
                    reviews: [newReview, ...state.reviews],
                }));

                return id;
            },

            addComment: ({ reviewId, bookId, userName, text }) => {
                const id = String(Date.now());
                const createdAt = Date.now();

                const newComment: Comment = {
                    id,
                    reviewId,
                    bookId,
                    userName,
                    text: text.trim(),
                    createdAt,
                };

                set((state) => ({
                    reviews: state.reviews.map((r) =>
                        r.id === reviewId
                            ? {
                                ...r,
                                comments: [newComment, ...r.comments],
                            }
                            : r
                    ),
                }));
            },

            resetReviews: () => set({ reviews: [] }),
        }),
        {
            name: 'lumina-reviews',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
