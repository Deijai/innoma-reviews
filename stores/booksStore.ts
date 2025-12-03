// stores/booksStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { BOOKS, type Book, type BookStatus } from '../constants/mockData';

type BooksState = {
    books: Book[];
    setStatus: (id: string, status: BookStatus) => void;
    updateProgress: (id: string, currentPage: number) => void;
    resetLibrary: () => void;
};

export const useBooksStore = create<BooksState>()(
    persist(
        (set, get) => ({
            books: BOOKS, // estado inicial vem dos mocks

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
                                    Math.min(
                                        currentPage,
                                        b.pages || currentPage
                                    )
                                ),
                            }
                            : b
                    ),
                })),

            // útil pra debug / logout completo
            resetLibrary: () => set({ books: BOOKS }),
        }),
        {
            name: 'lumina-books',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
