// stores/reviewsStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { REVIEWS } from '../mocks/reviews';
import type { Review } from '../types/review';

type ReviewsState = {
    reviews: Review[];

    setReviews: (reviews: Review[]) => void;
    addReview: (review: Review) => void;
};

export const useReviewsStore = create<ReviewsState>()(
    persist(
        (set, get) => ({
            reviews: REVIEWS,

            setReviews(reviews) {
                set({ reviews });
            },

            addReview(review) {
                const current = get().reviews;
                set({ reviews: [review, ...current] });
            },
        }),
        {
            name: 'lumina-reviews',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
