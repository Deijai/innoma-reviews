// stores/booksStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Book, BookStatus } from '../types/book';

type BooksState = {
    books: Book[];

    setBooks: (books: Book[]) => void;
    updateStatus: (bookId: string, status: BookStatus) => void;
    updateProgress: (bookId: string, currentPage: number) => void;
};

export const useBooksStore = create<BooksState>()(
    persist(
        (set, get) => ({
            // ✅ Começa vazio - livros vêm do Firestore
            books: [],

            /**
             * Atualiza a lista de livros vinda do Firestore,
             * preservando status e currentPage já salvos localmente.
             */
            setBooks(books) {
                set((state) => {
                    const existingMap = new Map<string, Book>(
                        state.books.map((b) => [b.id, b]),
                    );

                    const merged = books.map((book) => {
                        const existing = existingMap.get(book.id);
                        if (!existing) {
                            return book;
                        }

                        return {
                            ...book,
                            status: existing.status,
                            currentPage: existing.currentPage,
                        };
                    });

                    return { books: merged };
                });
            },

            updateStatus(bookId, status) {
                const current = get().books;
                const updated = current.map((book) =>
                    book.id === bookId ? { ...book, status } : book,
                );
                set({ books: updated });
            },

            updateProgress(bookId, currentPage) {
                const current = get().books;
                const updated = current.map((book) =>
                    book.id === bookId
                        ? {
                            ...book,
                            currentPage:
                                currentPage > book.pages
                                    ? book.pages
                                    : Math.max(currentPage, 0),
                        }
                        : book,
                );
                set({ books: updated });
            },
        }),
        {
            name: 'lumina-books',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);