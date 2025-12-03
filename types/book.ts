// src/types/book.ts

export type BookStatus = 'reading' | 'want' | 'read';

export interface Book {
    id: string;
    title: string;
    author: string;
    pages: number;
    currentPage: number;
    status: BookStatus;
    rating: number; // 0–5
    description: string;
    tags: string[];
    coverUrl?: string;
    // futuro: ownerId, createdAt, updatedAt etc.
}
