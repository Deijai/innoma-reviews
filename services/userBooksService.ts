// services/userBooksService.ts
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from 'firebase/firestore';
import { useAuthStore } from '../stores/authStore';
import { useBooksStore } from '../stores/booksStore';
import type { Book, BookStatus } from '../types/book';
import { db } from './firebaseConfig';

/**
 * Documento da estante do usuário no Firestore
 */
export interface UserBookShelf {
    id: string;
    userId: string;
    bookId: string;
    status: BookStatus;
    currentPage: number;
    addedAt: number;
    updatedAt: number;
    bookData: {
        title: string;
        author: string;
        coverUrl?: string;
        pages: number;
        isbn?: string;
        publisher?: string;
        publishedDate?: string;
        description?: string;
        rating?: number;
        tags?: string[];
    };
}

function mapShelfDoc(d: any, id: string): UserBookShelf {
    return {
        id,
        userId: d.userId,
        bookId: d.bookId,
        status: d.status || 'want',
        currentPage: d.currentPage || 0,
        addedAt: typeof d.addedAt === 'number' ? d.addedAt : Date.now(),
        updatedAt: typeof d.updatedAt === 'number' ? d.updatedAt : Date.now(),
        bookData: d.bookData || {},
    };
}

/**
 * Busca todos os livros da estante do usuário atual
 */
export async function fetchUserBooks(): Promise<Book[]> {
    const authUser = useAuthStore.getState().user;

    if (!authUser) {
        console.log('Nenhum usuário logado, retornando array vazio');
        return [];
    }

    try {
        const q = query(
            collection(db, 'userBooks'),
            where('userId', '==', authUser.id)
        );

        const snap = await getDocs(q);
        console.log(`Encontrados ${snap.docs.length} livros na estante do usuário`);

        const userBooks: UserBookShelf[] = snap.docs.map((docSnap) =>
            mapShelfDoc(docSnap.data(), docSnap.id)
        );

        // Converte para o formato Book do store
        const books: Book[] = userBooks.map((ub) => ({
            id: ub.bookId,
            title: ub.bookData.title,
            author: ub.bookData.author,
            coverUrl: ub.bookData.coverUrl,
            pages: ub.bookData.pages || 0,
            currentPage: ub.currentPage,
            status: ub.status,
            isbn: ub.bookData.isbn,
            publisher: ub.bookData.publisher,
            publishedDate: ub.bookData.publishedDate,
            description: ub.bookData.description || '',
            rating: ub.bookData.rating || 0,
            tags: ub.bookData.tags || [],
        }));

        // Atualiza o store
        useBooksStore.getState().setBooks(books);

        return books;
    } catch (error) {
        console.error('Erro ao buscar livros do usuário:', error);
        return [];
    }
}

/**
 * Adiciona um livro à estante do usuário
 */
export async function addBookToUserShelf(
    book: Book,
    status: BookStatus = 'want'
): Promise<void> {
    const authUser = useAuthStore.getState().user;

    if (!authUser) {
        throw new Error('Usuário não autenticado');
    }

    try {
        // Verifica se já existe
        const q = query(
            collection(db, 'userBooks'),
            where('userId', '==', authUser.id),
            where('bookId', '==', book.id)
        );

        const snap = await getDocs(q);

        if (!snap.empty) {
            // Já existe, atualiza
            const docRef = doc(db, 'userBooks', snap.docs[0].id);
            await setDoc(
                docRef,
                {
                    status,
                    updatedAt: Date.now(),
                },
                { merge: true }
            );
            console.log('Livro atualizado na estante');
        } else {
            // Cria novo
            const payload = {
                userId: authUser.id,
                bookId: book.id,
                status,
                currentPage: book.currentPage || 0,
                addedAt: Date.now(),
                updatedAt: Date.now(),
                bookData: {
                    title: book.title,
                    author: book.author,
                    coverUrl: book.coverUrl,
                    pages: book.pages,
                    isbn: book.isbn,
                    publisher: book.publisher,
                    publishedDate: book.publishedDate,
                    description: book.description,
                    rating: book.rating,
                    tags: book.tags,
                },
            };

            await addDoc(collection(db, 'userBooks'), payload);
            console.log('Livro adicionado à estante');
        }

        // Atualiza o store local
        await fetchUserBooks();
    } catch (error) {
        console.error('Erro ao adicionar livro à estante:', error);
        throw error;
    }
}

/**
 * Remove um livro da estante do usuário
 */
export async function removeBookFromUserShelf(bookId: string): Promise<void> {
    const authUser = useAuthStore.getState().user;

    if (!authUser) {
        throw new Error('Usuário não autenticado');
    }

    try {
        const q = query(
            collection(db, 'userBooks'),
            where('userId', '==', authUser.id),
            where('bookId', '==', bookId)
        );

        const snap = await getDocs(q);

        if (!snap.empty) {
            await deleteDoc(doc(db, 'userBooks', snap.docs[0].id));
            console.log('Livro removido da estante');
        }

        // Atualiza o store local
        await fetchUserBooks();
    } catch (error) {
        console.error('Erro ao remover livro da estante:', error);
        throw error;
    }
}

/**
 * Atualiza o status de um livro na estante
 */
export async function updateUserBookStatus(
    bookId: string,
    status: BookStatus
): Promise<void> {
    const authUser = useAuthStore.getState().user;

    if (!authUser) {
        throw new Error('Usuário não autenticado');
    }

    try {
        const q = query(
            collection(db, 'userBooks'),
            where('userId', '==', authUser.id),
            where('bookId', '==', bookId)
        );

        const snap = await getDocs(q);

        if (!snap.empty) {
            const docRef = doc(db, 'userBooks', snap.docs[0].id);
            await setDoc(
                docRef,
                {
                    status,
                    updatedAt: Date.now(),
                },
                { merge: true }
            );
            console.log('Status do livro atualizado');
        }

        // Atualiza o store local
        useBooksStore.getState().updateStatus(bookId, status);
    } catch (error) {
        console.error('Erro ao atualizar status do livro:', error);
        throw error;
    }
}

/**
 * Atualiza o progresso de leitura de um livro
 */
export async function updateUserBookProgress(
    bookId: string,
    currentPage: number
): Promise<void> {
    const authUser = useAuthStore.getState().user;

    if (!authUser) {
        throw new Error('Usuário não autenticado');
    }

    try {
        const q = query(
            collection(db, 'userBooks'),
            where('userId', '==', authUser.id),
            where('bookId', '==', bookId)
        );

        const snap = await getDocs(q);

        if (!snap.empty) {
            const docRef = doc(db, 'userBooks', snap.docs[0].id);
            await setDoc(
                docRef,
                {
                    currentPage,
                    updatedAt: Date.now(),
                },
                { merge: true }
            );
            console.log('Progresso do livro atualizado');
        }

        // Atualiza o store local
        useBooksStore.getState().updateProgress(bookId, currentPage);
    } catch (error) {
        console.error('Erro ao atualizar progresso do livro:', error);
        throw error;
    }
}