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
            // começa com mocks
            books: BOOKS,

            setBooks(books) {
                set({ books });
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
                                currentPage > book.pages ? book.pages : Math.max(currentPage, 0),
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
