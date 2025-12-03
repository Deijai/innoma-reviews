import { REVIEWS } from '../mocks/reviews';
import { useReviewsStore } from '../stores/reviewsStore';
import type { Review } from '../types/review';

let loadedMocks = false;

function ensureReviewsLoaded() {
    const state = useReviewsStore.getState();
    if (!loadedMocks && (!state.reviews || state.reviews.length === 0)) {
        state.setReviews?.(REVIEWS);
        loadedMocks = true;
    }
}

/**
 * Todas as reviews de um livro.
 */
export async function fetchReviewsForBook(bookId: string): Promise<Review[]> {
    ensureReviewsLoaded();
    const state = useReviewsStore.getState();
    return state.reviews.filter((r) => r.bookId === bookId);
}

/**
 * Uma review específica.
 */
export async function fetchReviewById(
    reviewId: string
): Promise<Review | undefined> {
    ensureReviewsLoaded();
    const state = useReviewsStore.getState();
    return state.reviews.find((r) => r.id === reviewId);
}

/**
 * 🔹 NOVO: retorna TODAS as reviews (para perfil, estatísticas, etc.)
 */
export async function fetchAllReviews(): Promise<Review[]> {
    ensureReviewsLoaded();
    const state = useReviewsStore.getState();
    return state.reviews;
}

/**
 * Reviews recentes (pro feed da Home).
 */
export async function fetchRecentReviews(limit = 5): Promise<Review[]> {
    ensureReviewsLoaded();
    const state = useReviewsStore.getState();
    return state.reviews
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit);
}

type CreateReviewInput = {
    bookId: string;
    userId: string;
    userName: string;
    rating: number;
    title: string;
    text: string;
    containsSpoilers: boolean;
};

/**
 * Cria uma nova review (mock).
 */
export async function createReview(
    input: CreateReviewInput
): Promise<Review> {
    ensureReviewsLoaded();
    const state = useReviewsStore.getState();

    const newReview: Review = {
        id: `rev-${Date.now()}`,
        bookId: input.bookId,
        userId: input.userId,
        userName: input.userName,
        userAvatar: null,
        rating: input.rating,
        title: input.title,
        text: input.text,
        containsSpoilers: input.containsSpoilers,
        likes: 0,
        commentsCount: 0,
        createdAt: Date.now(),
    };

    state.addReview?.(newReview);

    // futuro: salvar no Firestore
    return newReview;
}
