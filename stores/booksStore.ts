// stores/booksStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { BOOKS } from '../mocks/books';
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
            // começa com mocks (mas o persist vai sobrescrever depois)
            books: BOOKS,

            /**
             * Atualiza a lista de livros vinda da API,
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
