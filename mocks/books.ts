import { Book } from "@/types/book";

export const BOOKS: Book[] = [
    {
        id: 'atomic-habits',
        title: 'Hábitos Atômicos',
        author: 'James Clear',
        pages: 320,
        currentPage: 120,
        status: 'reading',
        rating: 4.8,
        description:
            'Um guia prático para construir bons hábitos, eliminar os ruins e dominar pequenos comportamentos que levam a resultados extraordinários.',
        tags: ['produtividade', 'desenvolvimento pessoal', 'hábitos'],
        coverUrl:
            'https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL.jpg',
    },
    {
        id: 'deep-work',
        title: 'Trabalho Focado',
        author: 'Cal Newport',
        pages: 304,
        currentPage: 70,
        status: 'reading',
        rating: 4.6,
        description:
            'Como ter foco em um mundo cheio de distrações e produzir em nível profissional com profundidade e qualidade.',
        tags: ['produtividade', 'foco', 'trabalho'],
        coverUrl:
            'https://images-na.ssl-images-amazon.com/images/I/71gypi8w4LL.jpg',
    },
    {
        id: 'harry-potter-1',
        title: 'Harry Potter e a Pedra Filosofal',
        author: 'J.K. Rowling',
        pages: 264,
        currentPage: 0,
        status: 'want',
        rating: 4.9,
        description:
            'O início da jornada de Harry no mundo da magia, descobrindo Hogwarts e seu passado.',
        tags: ['fantasia', 'ficção', 'jovem'],
        coverUrl:
            'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg',
    },
    {
        id: 'harry-potter-2',
        title: 'Harry Potter e a Câmara Secreta',
        author: 'J.K. Rowling',
        pages: 288,
        currentPage: 0,
        status: 'want',
        rating: 4.8,
        description:
            'O segundo ano de Harry em Hogwarts, com novos mistérios e perigos na escola de magia.',
        tags: ['fantasia', 'ficção'],
        coverUrl:
            'https://images-na.ssl-images-amazon.com/images/I/91OINeHnJGL.jpg',
    },
    {
        id: 'clean-code',
        title: 'Código Limpo',
        author: 'Robert C. Martin',
        pages: 464,
        currentPage: 300,
        status: 'reading',
        rating: 4.7,
        description:
            'Práticas, padrões e princípios para escrever código legível, sustentável e de fácil manutenção.',
        tags: ['programação', 'engenharia de software', 'boas práticas'],
        coverUrl:
            'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL.jpg',
    },
    {
        id: 'the-alchemist',
        title: 'O Alquimista',
        author: 'Paulo Coelho',
        pages: 208,
        currentPage: 208,
        status: 'read',
        rating: 4.3,
        description:
            'A jornada de Santiago em busca de seu tesouro pessoal e do sentido da vida.',
        tags: ['ficção', 'espiritualidade', 'clássico'],
        coverUrl:
            'https://images-na.ssl-images-amazon.com/images/I/81H1Z9hUx1L.jpg',
    },
    {
        id: 'thinking-fast-and-slow',
        title: 'Rápido e Devagar',
        author: 'Daniel Kahneman',
        pages: 608,
        currentPage: 450,
        status: 'read',
        rating: 4.5,
        description:
            'Uma exploração profunda sobre como pensamos, decidimos e somos influenciados por vieses cognitivos.',
        tags: ['psicologia', 'comportamento', 'ciência'],
        coverUrl:
            'https://images-na.ssl-images-amazon.com/images/I/71b5P3RyDSL.jpg',
    },
    {
        id: 'design-of-everyday-things',
        title: 'A Psicologia das Coisas do Cotidiano',
        author: 'Don Norman',
        pages: 368,
        currentPage: 0,
        status: 'want',
        rating: 4.4,
        description:
            'Como o design afeta nossa relação com produtos e sistemas no dia a dia.',
        tags: ['design', 'ux', 'psicologia'],
        coverUrl:
            'https://images-na.ssl-images-amazon.com/images/I/71sBtM3Yi5L.jpg',
    },
    {
        id: 'deep-learning',
        title: 'Deep Learning',
        author: 'Ian Goodfellow',
        pages: 800,
        currentPage: 120,
        status: 'reading',
        rating: 4.2,
        description:
            'Uma visão abrangente dos fundamentos teóricos e práticos de deep learning.',
        tags: ['inteligência artificial', 'machine learning', 'técnico'],
        coverUrl:
            'https://images-na.ssl-images-amazon.com/images/I/81vqr4Rz7-L.jpg',
    },
    {
        id: 'hobbit',
        title: 'O Hobbit',
        author: 'J.R.R. Tolkien',
        pages: 320,
        currentPage: 320,
        status: 'read',
        rating: 4.9,
        description:
            'A aventura de Bilbo Bolseiro pela Terra-média antes dos eventos de O Senhor dos Anéis.',
        tags: ['fantasia', 'clássico', 'aventura'],
        coverUrl:
            'https://images-na.ssl-images-amazon.com/images/I/91b0C2YNSrL.jpg',
    },
];
