// stores/booksStore.ts
import { create } from 'zustand';
import { BOOKS, type Book, type BookStatus } from '../constants/mockData';

type BooksState = {
    books: Book[];
    setStatus: (id: string, status: BookStatus) => void;
    updateProgress: (id: string, currentPage: number) => void;
};

export const useBooksStore = create<BooksState>((set) => ({
    // Inicializa com os mocks
    books: BOOKS,

    setStatus: (id, status) =>
        set((state) => ({
            books: state.books.map((b) =>
                b.id === id ? { ...b, status } : b
            ),
        })),

    updateProgress: (id, currentPage) =>
        set((state) => ({
            books: state.books.map((b) =>
                b.id === id
                    ? {
                        ...b,
                        currentPage: Math.max(
                            0,
                            Math.min(currentPage, b.pages || currentPage)
                        ),
                    }
                    : b
            ),
        })),
}));
