// src/services/reviewsService.ts
import {
    addDoc,
    collection,
    doc,
    limit as fsLimit,
    getDoc,
    getDocs,
    orderBy,
    query,
    where,
} from 'firebase/firestore';
import { useAuthStore } from '../stores/authStore';
import { useReviewsStore } from '../stores/reviewsStore';
import type { Review } from '../types/review';
import { db } from './firebaseConfig';

function mapReviewDoc(d: any, id: string): Review {
    // createdAt armazenado como number (Date.now()) por enquanto
    return {
        id,
        bookId: d.bookId,
        userId: d.userId,
        userName: d.userName,
        userAvatar: d.userAvatar ?? null,
        rating: d.rating,
        title: d.title,
        text: d.text,
        containsSpoilers: d.containsSpoilers ?? false,
        likes: d.likes ?? 0,
        commentsCount: d.commentsCount ?? 0,
        createdAt: typeof d.createdAt === 'number' ? d.createdAt : Date.now(),
    };
}

/**
 * Todas as reviews de um livro.
 */
export async function fetchReviewsForBook(bookId: string): Promise<Review[]> {
    const q = query(
        collection(db, 'reviews'),
        where('bookId', '==', bookId),
        orderBy('createdAt', 'desc'),
    );

    const snap = await getDocs(q);
    const reviews: Review[] = snap.docs.map((docSnap) =>
        mapReviewDoc(docSnap.data(), docSnap.id),
    );

    const { setReviews } = useReviewsStore.getState();
    setReviews(reviews);

    return reviews;
}

/**
 * Uma review específica.
 */
export async function fetchReviewById(
    reviewId: string,
): Promise<Review | undefined> {
    const state = useReviewsStore.getState();
    const existing = state.reviews.find((r) => r.id === reviewId);
    if (existing) return existing;

    const ref = doc(db, 'reviews', reviewId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return undefined;

    const review = mapReviewDoc(snap.data(), snap.id);
    state.addReview(review);
    return review;
}

/**
 * Reviews recentes (para feed da Home).
 */
export async function fetchRecentReviews(limit = 5): Promise<Review[]> {
    const q = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc'),
        fsLimit(limit),
    );

    const snap = await getDocs(q);
    const reviews: Review[] = snap.docs.map((docSnap) =>
        mapReviewDoc(docSnap.data(), docSnap.id),
    );

    const { setReviews } = useReviewsStore.getState();
    setReviews(reviews);

    return reviews;
}

/**
 * Todas as reviews do usuário atual (para perfil).
 */
export async function fetchAllReviews(): Promise<Review[]> {
    const authUser = useAuthStore.getState().user;

    if (!authUser) {
        // Se não houver usuário logado, retorna array vazio
        return [];
    }

    const q = query(
        collection(db, 'reviews'),
        where('userId', '==', authUser.id),
        orderBy('createdAt', 'desc'),
    );

    const snap = await getDocs(q);
    const reviews: Review[] = snap.docs.map((docSnap) =>
        mapReviewDoc(docSnap.data(), docSnap.id),
    );

    const { setReviews } = useReviewsStore.getState();
    setReviews(reviews);

    return reviews;
}

type CreateReviewInput = {
    bookId: string;
    rating: number;
    title: string;
    text: string;
    containsSpoilers: boolean;
};

/**
 * Cria uma nova review (Firestore + store).
 */
export async function createReview(
    input: CreateReviewInput,
): Promise<Review> {
    const authUser = useAuthStore.getState().user;
    if (!authUser) {
        throw new Error('Usuário não autenticado');
    }

    const payload = {
        bookId: input.bookId,
        userId: authUser.id,
        userName: authUser.displayName || authUser.email,
        userAvatar: authUser.photoURL ?? null,
        rating: input.rating,
        title: input.title,
        text: input.text,
        containsSpoilers: input.containsSpoilers,
        likes: 0,
        commentsCount: 0,
        createdAt: Date.now(),
    };

    const ref = await addDoc(collection(db, 'reviews'), payload);

    const review: Review = {
        id: ref.id,
        ...payload,
    };

    useReviewsStore.getState().addReview(review);

    return review;
}