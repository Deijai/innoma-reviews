// stores/commentsStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { COMMENTS } from '../mocks/comments';
import type { Comment } from '../types/comment';

type CommentsState = {
    comments: Comment[];

    setComments: (comments: Comment[]) => void;
    addComment: (comment: Comment) => void;
};

export const useCommentsStore = create<CommentsState>()(
    persist(
        (set, get) => ({
            comments: COMMENTS,

            setComments(comments) {
                set({ comments });
            },

            addComment(comment) {
                const current = get().comments;
                set({ comments: [...current, comment] });
            },
        }),
        {
            name: 'lumina-comments',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
