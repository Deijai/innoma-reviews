// services/isbnDbClient.ts
import axios from 'axios';

// 👉 Idealmente isso deveria vir de variável de ambiente (.env)
// mas como é um app de estudo, vou deixar aqui e você pode extrair depois.
const ISBNDB_API_KEY = '65803_16490a28987664ad20c4f190745bbe49';

// Base URL oficial da ISBNdb v2
// Referência: exemplos da própria documentação (JavaScript, Python etc).
// Ex.: fetch('https://api2.isbndb.com/book/9781934759486', { headers })
const ISBNDB_BASE_URL = 'https://api2.isbndb.com';

export const isbnDbApi = axios.create({
    baseURL: ISBNDB_BASE_URL,
    timeout: 10000,
    headers: {
        // A doc usa header Authorization com a key direta
        // ex.: { 'Authorization': 'YOUR_REST_KEY' }
        Authorization: ISBNDB_API_KEY,
    },
});

// Tipos do payload cru da API
export interface IsbnDbBook {
    isbn: string;
    isbn13?: string;
    title: string;
    subtitle?: string;
    authors: string[];
    publisher?: string;
    pages?: number;
    date_published?: string;
    subjects?: string[];
    synopsis?: string;
    image?: string;
    language?: string;
    binding?: string;
    edition?: string;
}

export interface IsbnDbBooksResponse {
    books: IsbnDbBook[];
    total?: number;
    page?: number;
    pageSize?: number;
}

export interface IsbnDbBookResponse {
    book: IsbnDbBook;
}

/**
 * Busca livros na ISBNdb usando o endpoint:
 * GET /books/:query?page=&pageSize=
 */
export async function searchIsbnDbBooks(
    query: string,
    page = 1,
    pageSize = 20,
): Promise<IsbnDbBook[]> {
    const response = await isbnDbApi.get<IsbnDbBooksResponse>(
        `/books/${encodeURIComponent(query)}`,
        {
            params: { page, pageSize },
        },
    );

    return response.data.books ?? [];
}

/**
 * Busca um único livro pelo ISBN (10 ou 13):
 * GET /book/:isbn
 */
export async function getIsbnDbBookByIsbn(
    isbn: string,
): Promise<IsbnDbBook | null> {
    const response = await isbnDbApi.get<IsbnDbBookResponse>(
        `/book/${encodeURIComponent(isbn)}`,
    );

    return response.data.book ?? null;
}
