// constants/mockData.ts

export type BookStatus = 'reading' | 'want' | 'read';

export type Book = {
    id: string;
    title: string;
    author: string;
    status: BookStatus;
    rating: number; // 0-5
    pages: number;
    currentPage: number;
    description: string;
    tags: string[];
};

export const BOOKS: Book[] = [
    {
        id: 'clean-architecture',
        title: 'Clean Architecture',
        author: 'Robert C. Martin',
        status: 'reading',
        rating: 4.7,
        pages: 420,
        currentPage: 180,
        description:
            'Um guia prático para criar sistemas de software robustos, flexíveis e de fácil manutenção usando princípios de arquitetura limpa.',
        tags: ['Arquitetura', 'Boas práticas', 'Engenharia de software'],
    },
    {
        id: 'pragmatic-programmer',
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt & David Thomas',
        status: 'read',
        rating: 4.9,
        pages: 352,
        currentPage: 352,
        description:
            'Clássico que apresenta princípios práticos para se tornar um desenvolvedor mais eficaz e pragmático.',
        tags: ['Carreira', 'Boas práticas'],
    },
    {
        id: 'atomic-habits',
        title: 'Atomic Habits',
        author: 'James Clear',
        status: 'read',
        rating: 4.8,
        pages: 320,
        currentPage: 320,
        description:
            'Como pequenos hábitos, quando bem estruturados, geram mudanças significativas ao longo do tempo.',
        tags: ['Hábitos', 'Produtividade', 'Desenvolvimento pessoal'],
    },
    {
        id: 'deep-work',
        title: 'Deep Work',
        author: 'Cal Newport',
        status: 'want',
        rating: 4.6,
        pages: 304,
        currentPage: 0,
        description:
            'Explora o poder do foco profundo em um mundo cheio de distrações para produzir trabalho de alto valor.',
        tags: ['Foco', 'Produtividade'],
    },
    {
        id: 'ddd-blue-book',
        title: 'Domain-Driven Design',
        author: 'Eric Evans',
        status: 'want',
        rating: 4.5,
        pages: 560,
        currentPage: 0,
        description:
            'Livro clássico sobre modelagem de domínios complexos e alinhamento do software com o negócio.',
        tags: ['DDD', 'Arquitetura'],
    },
];
