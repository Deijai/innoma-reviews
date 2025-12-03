// services/booksService.ts
import { useBooksStore } from '../stores/booksStore';
import type { Book, BookStatus } from '../types/book';

export async function fetchAllBooks(): Promise<Book[]> {
    return useBooksStore.getState().books;
}

export async function fetchBookById(id: string): Promise<Book | undefined> {
    const books = useBooksStore.getState().books;
    return books.find((b) => b.id === id);
}

export async function fetchBooksByStatus(
    status: BookStatus,
): Promise<Book[]> {
    const books = useBooksStore.getState().books;
    return books.filter((b) => b.status === status);
}

export async function fetchRecommendedBooks(): Promise<Book[]> {
    const books = useBooksStore.getState().books;
    return books
        .slice()
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
}

export async function searchBooks(term: string): Promise<Book[]> {
    const books = useBooksStore.getState().books;
    const q = term.trim().toLowerCase();
    if (!q) return [];

    return books.filter((b) => {
        return (
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            b.tags.some((t) => t.toLowerCase().includes(q))
        );
    });
}

export async function updateBookStatus(
    bookId: string,
    status: BookStatus,
): Promise<void> {
    useBooksStore.getState().updateStatus(bookId, status);
}

export async function updateBookProgress(
    bookId: string,
    currentPage: number,
): Promise<void> {
    useBooksStore.getState().updateProgress(bookId, currentPage);
}
