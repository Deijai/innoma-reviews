// src/services/commentsService.ts
import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    where,
} from 'firebase/firestore';
import { useAuthStore } from '../stores/authStore';
import { useReviewsStore } from '../stores/reviewsStore';
import type { Comment } from '../types/comment';
import { db } from './firebaseConfig';

function mapCommentDoc(d: any, id: string): Comment {
    return {
        id,
        reviewId: d.reviewId,
        bookId: d.bookId,
        userId: d.userId,
        userName: d.userName,
        userAvatar: d.userAvatar ?? null,
        text: d.text,
        parentCommentId: d.parentCommentId ?? null,
        createdAt: typeof d.createdAt === 'number' ? d.createdAt : Date.now(),
    };
}

export async function fetchCommentsForReview(
    reviewId: string,
): Promise<Comment[]> {
    const q = query(
        collection(db, 'comments'),
        where('reviewId', '==', reviewId),
        orderBy('createdAt', 'asc'),
    );

    const snap = await getDocs(q);
    const comments: Comment[] = snap.docs.map((docSnap) =>
        mapCommentDoc(docSnap.data(), docSnap.id),
    );

    useReviewsStore.getState().setComments(comments);

    return comments;
}

type CreateCommentInput = {
    reviewId: string;
    bookId: string;
    text: string;
    parentCommentId?: string | null;
};

export async function createComment(
    input: CreateCommentInput,
): Promise<Comment> {
    const authUser = useAuthStore.getState().user;
    if (!authUser) {
        throw new Error('Usuário não autenticado');
    }

    const payload = {
        reviewId: input.reviewId,
        bookId: input.bookId,
        userId: authUser.id,
        userName: authUser.displayName || authUser.email,
        userAvatar: authUser.photoURL ?? null,
        text: input.text,
        parentCommentId: input.parentCommentId ?? null,
        createdAt: Date.now(),
    };

    const ref = await addDoc(collection(db, 'comments'), payload);

    const comment: Comment = {
        id: ref.id,
        ...payload,
    };

    // Atualiza store (lista de comentários)
    const store = useReviewsStore.getState();
    store.setComments([comment, ...store.comments]);

    // Atualiza contador na review em memória
    const updatedReviews = store.reviews.map((r) =>
        r.id === input.reviewId
            ? { ...r, commentsCount: (r.commentsCount ?? 0) + 1 }
            : r,
    );
    store.setReviews(updatedReviews);

    return comment;
}
