// services/booksService.ts
import { useBooksStore } from '../stores/booksStore';
import type { Book, BookStatus } from '../types/book';
import {
    mapIsbnDbBookToBook,
    mapIsbnDbBooksToBooks,
} from './bookMapper';
import {
    getIsbnDbBookByIsbn,
    searchIsbnDbBooks,
} from './isbnDbClient';
import {
    addBookToUserShelf,
    fetchUserBooks,
    updateUserBookProgress,
    updateUserBookStatus,
} from './userBooksService';

const DEFAULT_DISCOVERY_QUERY = 'programming';

/**
 * Busca todos os livros da estante do usuário (do Firestore)
 */
export async function fetchAllBooks(): Promise<Book[]> {
    try {
        return await fetchUserBooks();
    } catch (error) {
        console.log('Erro ao buscar livros do usuário:', error);
        return [];
    }
}

/**
 * Busca livros para descoberta da API (não salva no store do usuário)
 */
export async function fetchDiscoveryBooks(): Promise<Book[]> {
    try {
        const apiBooks = await searchIsbnDbBooks(DEFAULT_DISCOVERY_QUERY, 1, 30);
        return mapIsbnDbBooksToBooks(apiBooks);
    } catch (error) {
        console.log('Erro ao buscar livros de descoberta:', error);
        // ❌ REMOVER: return BOOKS; // Fallback para mocks
        return []; // ✅ Retorna vazio se a API falhar
    }
}

export async function fetchBookById(id: string): Promise<Book | undefined> {
    const { books } = useBooksStore.getState();

    // 1) tenta achar no store (estante do usuário)
    const found = books.find((b) => b.id === id);
    if (found) return found;

    // 2) tenta buscar na API, tratando o ID como ISBN
    try {
        const apiBook = await getIsbnDbBookByIsbn(id);
        if (!apiBook) return undefined;

        return mapIsbnDbBookToBook(apiBook);
    } catch (error) {
        console.log('Erro ao buscar livro por ID/ISBN:', error);
        return undefined;
    }
}

export async function fetchBooksByStatus(
    status: BookStatus,
): Promise<Book[]> {
    const { books } = useBooksStore.getState();
    return books.filter((b) => b.status === status);
}

export async function searchBooksByQuery(
    query: string,
    page = 1,
    pageSize = 20,
): Promise<Book[]> {
    if (!query.trim()) {
        return [];
    }

    try {
        const apiBooks = await searchIsbnDbBooks(query.trim(), page, pageSize);
        return mapIsbnDbBooksToBooks(apiBooks);
    } catch (error) {
        console.log('Erro ao buscar livros por query:', error);
        return [];
    }
}

/**
 * Adiciona livro à estante do usuário
 */
export async function addBookToShelf(
    book: Book,
    status: BookStatus = 'want'
): Promise<void> {
    await addBookToUserShelf(book, status);
}

/**
 * Atualiza status do livro na estante
 */
export async function updateBookStatus(
    bookId: string,
    status: BookStatus,
): Promise<void> {
    await updateUserBookStatus(bookId, status);
}

/**
 * Atualiza progresso do livro
 */
export async function updateBookProgress(
    bookId: string,
    currentPage: number,
): Promise<void> {
    await updateUserBookProgress(bookId, currentPage);
}