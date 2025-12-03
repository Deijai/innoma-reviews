// constants/mockData.ts
export type BookStatus = 'reading' | 'want' | 'read';

export type Book = {
    id: string;
    title: string;
    author: string;
    pages: number;
    currentPage: number;
    rating: number;
    status: BookStatus;
    tags: string[];
    description: string;
};

export const BOOKS: Book[] = [
    {
        id: 'atomic-habits',
        title: 'Hábitos Atômicos',
        author: 'James Clear',
        pages: 320,
        currentPage: 64,
        rating: 4.8,
        status: 'reading', // 👈 LENDO AGORA
        tags: ['produtividade', 'hábitos', 'desenvolvimento pessoal'],
        description:
            'Um guia prático sobre como construir bons hábitos, eliminar maus hábitos e dominar os pequenos comportamentos que levam a resultados extraordinários.',
    },
    {
        id: 'deep-work',
        title: 'Trabalho Focado',
        author: 'Cal Newport',
        pages: 304,
        currentPage: 0,
        rating: 4.7,
        status: 'want', // 👈 QUERO LER
        tags: ['foco', 'produtividade', 'carreira'],
        description:
            'Uma análise sobre a importância do trabalho profundo em um mundo cheio de distrações e como cultivar a capacidade de se concentrar em tarefas cognitivas difíceis.',
    },
    {
        id: 'clean-code',
        title: 'Código Limpo',
        author: 'Robert C. Martin',
        pages: 464,
        currentPage: 464,
        rating: 4.9,
        status: 'read', // 👈 JÁ LIDO
        tags: ['programação', 'engenharia de software'],
        description:
            'Um clássico da engenharia de software que traz princípios, padrões e boas práticas para escrever código legível, manutenível e profissional.',
    },
    {
        id: 'ddd',
        title: 'Domain-Driven Design: Tackling Complexity in the Heart of Software',
        author: 'Eric Evans',
        pages: 560,
        currentPage: 120,
        rating: 4.6,
        status: 'reading',
        tags: ['arquitetura', 'domínio', 'software'],
        description:
            'Uma abordagem completa para lidar com complexidade em sistemas de software por meio de modelos ricos de domínio e colaboração intensa entre especialistas e desenvolvedores.',
    },
    {
        id: 'lean-startup',
        title: 'A Startup Enxuta',
        author: 'Eric Ries',
        pages: 336,
        currentPage: 0,
        rating: 4.5,
        status: 'want',
        tags: ['startup', 'negócios', 'inovação'],
        description:
            'Princípios para construir produtos e negócios inovadores usando ciclos rápidos de feedback, experimentação contínua e aprendizado validado.',
    },
];
