// src/services/commentsService.ts
import { COMMENTS } from '../mocks/comments';
import { useCommentsStore } from '../stores/commentsStore';
import type { Comment } from '../types/comment';

let loadedMocks = false;

function ensureCommentsLoaded() {
    const state = useCommentsStore.getState();
    if (!loadedMocks && (!state.comments || state.comments.length === 0)) {
        state.setComments?.(COMMENTS);
        loadedMocks = true;
    }
}

/**
 * Lista comentários (incluindo replies) de uma review.
 */
export async function fetchCommentsForReview(
    reviewId: string
): Promise<Comment[]> {
    ensureCommentsLoaded();
    const state = useCommentsStore.getState();
    return state.comments.filter((c) => c.reviewId === reviewId);
}

type AddCommentInput = {
    reviewId: string;
    userId: string;
    userName: string;
    text: string;
    parentCommentId?: string | null;
};

/**
 * Adiciona um novo comentário (mock).
 */
export async function addComment(
    input: AddCommentInput
): Promise<Comment> {
    ensureCommentsLoaded();
    const state = useCommentsStore.getState();

    const newComment: Comment = {
        id: `c-${Date.now()}`,
        reviewId: input.reviewId,
        userId: input.userId,
        userName: input.userName,
        userAvatar: null,
        text: input.text,
        parentCommentId: input.parentCommentId ?? null,
        createdAt: Date.now(),
    };

    state.addComment?.(newComment);

    // futuro: salvar em Firestore
    return newComment;
}
