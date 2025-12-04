// services/bookMapper.ts
import type { Book } from '../types/book';
import type { IsbnDbBook } from './isbnDbClient';

/**
 * Gera um ID interno baseado no ISBN (13 > 10 > title).
 * Assim, se amanhã você trocar de API, basta mudar o mapper.
 */
function resolveBookId(apiBook: IsbnDbBook): string {
    if (apiBook.isbn13 && apiBook.isbn13.trim().length > 0) {
        return apiBook.isbn13.trim();
    }
    if (apiBook.isbn && apiBook.isbn.trim().length > 0) {
        return apiBook.isbn.trim();
    }
    // fallback bem simples em cima do título
    return apiBook.title.toLowerCase().replace(/\s+/g, '-').slice(0, 64);
}

export function mapIsbnDbBookToBook(apiBook: IsbnDbBook): Book {
    const id = resolveBookId(apiBook);

    const title =
        apiBook.subtitle && apiBook.subtitle.trim().length > 0
            ? `${apiBook.title}: ${apiBook.subtitle}`
            : apiBook.title;

    const author =
        apiBook.authors && apiBook.authors.length > 0
            ? apiBook.authors.join(', ')
            : 'Autor desconhecido';

    const pages = apiBook.pages && apiBook.pages > 0 ? apiBook.pages : 0;

    const description =
        apiBook.synopsis && apiBook.synopsis.trim().length > 0
            ? apiBook.synopsis.trim()
            : 'Nenhuma descrição disponível para este livro.';

    const tags = apiBook.subjects && apiBook.subjects.length > 0
        ? apiBook.subjects
        : [];

    const isbn = apiBook.isbn13 || apiBook.isbn || undefined;

    return {
        id,
        title,
        author,
        pages,
        currentPage: 0,          // API não traz progresso de leitura
        status: 'want',          // por padrão, livros vindos da API entram como "quero ler"
        rating: 0,               // rating real virá das reviews mais pra frente
        description,
        tags,
        coverUrl: apiBook.image,
        isbn,
        publisher: apiBook.publisher,
        publishedDate: apiBook.date_published,
    };
}

export function mapIsbnDbBooksToBooks(apiBooks: IsbnDbBook[]): Book[] {
    return apiBooks.map(mapIsbnDbBookToBook);
}