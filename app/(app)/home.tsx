// app/(app)/home.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

import { BookCoverPreview } from '../../components/ui/BookCoverPreview';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { fetchAllBooks } from '../../services/booksService';
import { fetchRecentReviews } from '../../services/reviewsService';
import { useBooksStore } from '../../stores/booksStore';
import { useReviewsStore } from '../../stores/reviewsStore';

// Helper simples para tempo relativo
function formatRelativeTime(timestamp: number): string {
    const diffMs = Date.now() - timestamp;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'agora mesmo';
    if (diffMin < 60) return `há ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `há ${diffH} h`;
    const diffD = Math.floor(diffH / 24);
    return diffD === 1 ? 'há 1 dia' : `há ${diffD} dias`;
}

export default function HomeScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const books = useBooksStore((s) => s.books);
    const reviews = useReviewsStore((s) => s.reviews);

    const [loadingBooks, setLoadingBooks] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(false);

    // 🔄 Carregar livros da estante do usuário
    useEffect(() => {
        let isMounted = true;

        async function load() {
            try {
                setLoadingBooks(true);
                await fetchAllBooks();
            } catch (error) {
                console.log('Erro ao carregar livros na Home:', error);
            } finally {
                if (isMounted) setLoadingBooks(false);
            }
        }

        load();

        return () => {
            isMounted = false;
        };
    }, []);

    // 🔄 Carregar reviews recentes
    useEffect(() => {
        let isMounted = true;

        async function load() {
            try {
                setLoadingReviews(true);
                await fetchRecentReviews(10);
            } catch (error) {
                console.log('Erro ao carregar reviews na Home:', error);
            } finally {
                if (isMounted) setLoadingReviews(false);
            }
        }

        load();

        return () => {
            isMounted = false;
        };
    }, []);

    const { readingBooks, recommended } = useMemo(() => {
        if (!books.length) {
            return {
                readingBooks: [] as typeof books,
                recommended: [] as typeof books,
            };
        }

        const reading = books.filter((b) => b.status === 'reading');

        const recs = books
            .filter((b) => b.status !== 'reading')
            .slice(0, 5);

        return {
            readingBooks: reading,
            recommended: recs
        };
    }, [books]);

    const recentReviews = useMemo(
        () => reviews.slice(0, 5),
        [reviews],
    );

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 32,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Cabeçalho / saudação */}
                <View style={{ marginBottom: 20 }}>
                    <Text
                        style={{
                            fontSize: 13,
                            fontWeight: '600',
                            letterSpacing: 2,
                            textTransform: 'uppercase',
                            color: theme.colors.muted,
                        }}
                    >
                        BEM-VINDO AO LUMINA
                    </Text>
                    <Text
                        style={{
                            marginTop: 4,
                            fontSize: 24,
                            fontWeight: '800',
                            color: theme.colors.text,
                        }}
                    >
                        Seu hub de leitura em um só lugar
                    </Text>
                    <Text
                        style={{
                            marginTop: 6,
                            fontSize: 13,
                            color: theme.colors.muted,
                        }}
                    >
                        Continue o que está lendo, descubra novos títulos e veja
                        o que a comunidade está comentando.
                    </Text>
                </View>

                {/* Loader inicial de livros */}
                {loadingBooks && (
                    <View
                        style={{
                            marginBottom: 20,
                            padding: 12,
                            borderRadius: 16,
                            backgroundColor: theme.colors.card,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <ActivityIndicator
                            size="small"
                            color={theme.colors.primary}
                        />
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.colors.muted,
                            }}
                        >
                            Carregando sua estante...
                        </Text>
                    </View>
                )}

                {/* Mensagem quando não há livros */}
                {!loadingBooks && books.length === 0 && (
                    <View
                        style={{
                            marginBottom: 24,
                            padding: 20,
                            borderRadius: 20,
                            backgroundColor: theme.colors.card,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons
                            name="book-outline"
                            size={48}
                            color={theme.colors.muted}
                            style={{ marginBottom: 12 }}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '700',
                                color: theme.colors.text,
                                marginBottom: 6,
                                textAlign: 'center',
                            }}
                        >
                            Sua estante está vazia
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: theme.colors.muted,
                                marginBottom: 16,
                                textAlign: 'center',
                            }}
                        >
                            Comece adicionando livros que você quer ler ou já está lendo
                        </Text>
                        <PrimaryButton
                            title="Descobrir livros"
                            onPress={() => router.push('/(app)/discovery')}
                            style={{ paddingHorizontal: 24 }}
                        />
                    </View>
                )}

                {/* Bloco: Lendo agora - Scroll Horizontal */}
                {!loadingBooks && readingBooks.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 12,
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: '700',
                                        color: theme.colors.text,
                                    }}
                                >
                                    Lendo agora
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: theme.colors.muted,
                                        marginTop: 2,
                                    }}
                                >
                                    {readingBooks.length} {readingBooks.length === 1 ? 'livro' : 'livros'}
                                </Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => router.push('/(app)/library')}
                            >
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: '600',
                                        color: theme.colors.primary,
                                    }}
                                >
                                    Ver biblioteca
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 12 }}
                        >
                            {readingBooks.map((book) => {
                                const progress = book.pages > 0
                                    ? book.currentPage / book.pages
                                    : 0;

                                return (
                                    <View
                                        key={book.id}
                                        style={{
                                            width: 280,
                                            padding: 16,
                                            borderRadius: 20,
                                            backgroundColor: theme.colors.card,
                                            borderWidth: 1,
                                            borderColor: theme.colors.border,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'flex-start',
                                                marginBottom: 12,
                                            }}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: '800',
                                                        color: theme.colors.text,
                                                        marginBottom: 2,
                                                    }}
                                                    numberOfLines={2}
                                                >
                                                    {book.title}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 13,
                                                        color: theme.colors.muted,
                                                    }}
                                                    numberOfLines={1}
                                                >
                                                    {book.author}
                                                </Text>
                                            </View>

                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() =>
                                                    router.push(`/book/${book.id}`)
                                                }
                                                style={{ marginLeft: 8 }}
                                            >
                                                <BookCoverPreview
                                                    title={book.title}
                                                    author={book.author}
                                                    coverUrl={book.coverUrl}
                                                    compact
                                                />
                                            </TouchableOpacity>
                                        </View>

                                        {/* Progresso */}
                                        {book.pages > 0 && (
                                            <View style={{ marginBottom: 12 }}>
                                                <View
                                                    style={{
                                                        height: 6,
                                                        borderRadius: 999,
                                                        backgroundColor: theme.colors.border,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            height: 6,
                                                            borderRadius: 999,
                                                            width: `${Math.round(progress * 100)}%`,
                                                            backgroundColor: theme.colors.primary,
                                                        }}
                                                    />
                                                </View>
                                                <Text
                                                    style={{
                                                        marginTop: 4,
                                                        fontSize: 12,
                                                        color: theme.colors.muted,
                                                    }}
                                                >
                                                    Página{' '}
                                                    <Text
                                                        style={{
                                                            fontWeight: '700',
                                                            color: theme.colors.text,
                                                        }}
                                                    >
                                                        {book.currentPage}
                                                    </Text>{' '}
                                                    de{' '}
                                                    <Text
                                                        style={{
                                                            fontWeight: '700',
                                                            color: theme.colors.text,
                                                        }}
                                                    >
                                                        {book.pages}
                                                    </Text>
                                                </Text>
                                            </View>
                                        )}

                                        {/* Ações */}
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                gap: 8,
                                            }}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <PrimaryButton
                                                    title="Registrar"
                                                    onPress={() =>
                                                        router.push({
                                                            pathname: '/(app)/log-reading',
                                                            params: { bookId: book.id }
                                                        })
                                                    }
                                                    style={{ width: '100%' }}
                                                />
                                            </View>
                                            <TouchableOpacity
                                                activeOpacity={0.85}
                                                onPress={() =>
                                                    router.push(`/book/${book.id}`)
                                                }
                                                style={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: 999,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: theme.colors.background,
                                                    borderWidth: 1,
                                                    borderColor: theme.colors.border,
                                                }}
                                            >
                                                <Ionicons
                                                    name="open-outline"
                                                    size={18}
                                                    color={theme.colors.text}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}

                {/* Bloco: Recomendados */}
                {!loadingBooks && recommended.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 12,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '700',
                                    color: theme.colors.text,
                                }}
                            >
                                Recomendados para você
                            </Text>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() =>
                                    router.push('/(app)/discovery')
                                }
                            >
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: '600',
                                        color: theme.colors.primary,
                                    }}
                                >
                                    Ver todos
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    gap: 12,
                                }}
                            >
                                {recommended.map((book) => (
                                    <BookCoverPreview
                                        key={book.id}
                                        title={book.title}
                                        author={book.author}
                                        coverUrl={book.coverUrl}
                                        compact
                                        onPress={() =>
                                            router.push(`/book/${book.id}`)
                                        }
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                )}

                {/* Bloco: Atividade da comunidade */}
                {!loadingBooks && (
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 8,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '700',
                                    color: theme.colors.text,
                                }}
                            >
                                Atividade da comunidade
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 4,
                                }}
                            >
                                <Ionicons
                                    name="people-outline"
                                    size={16}
                                    color={theme.colors.muted}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: theme.colors.muted,
                                    }}
                                >
                                    Reviews recentes
                                </Text>
                            </View>
                        </View>

                        {loadingReviews ? (
                            <View
                                style={{
                                    padding: 14,
                                    borderRadius: 16,
                                    backgroundColor: theme.colors.card,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 10,
                                }}
                            >
                                <ActivityIndicator
                                    size="small"
                                    color={theme.colors.primary}
                                />
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: theme.colors.muted,
                                    }}
                                >
                                    Carregando reviews...
                                </Text>
                            </View>
                        ) : recentReviews.length === 0 ? (
                            <View
                                style={{
                                    padding: 14,
                                    borderRadius: 16,
                                    backgroundColor: theme.colors.card,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: theme.colors.text,
                                        marginBottom: 4,
                                    }}
                                >
                                    Ainda sem atividade
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: theme.colors.muted,
                                        marginBottom: 8,
                                    }}
                                >
                                    Publique a sua primeira review para começar a
                                    movimentar o feed.
                                </Text>
                                {books.length > 0 && (
                                    <PrimaryButton
                                        title="Escrever uma review"
                                        onPress={() => {
                                            if (readingBooks[0]) {
                                                router.push({
                                                    pathname: '/review/write',
                                                    params: { id: readingBooks[0].id },
                                                });
                                            } else if (books[0]) {
                                                router.push({
                                                    pathname: '/review/write',
                                                    params: { id: books[0].id },
                                                });
                                            }
                                        }}
                                    />
                                )}
                            </View>
                        ) : (
                            recentReviews.map((review) => (
                                <TouchableOpacity
                                    key={review.id}
                                    activeOpacity={0.9}
                                    style={{
                                        paddingVertical: 12,
                                        paddingHorizontal: 12,
                                        borderRadius: 16,
                                        marginBottom: 10,
                                        backgroundColor: theme.colors.card,
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
                                    }}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/review/comments',
                                            params: {
                                                id: review.bookId,
                                                reviewId: review.id,
                                            },
                                        })
                                    }
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginBottom: 4,
                                        }}
                                    >
                                        <Ionicons
                                            name="person-circle-outline"
                                            size={20}
                                            color={theme.colors.muted}
                                            style={{ marginRight: 6 }}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                fontWeight: '700',
                                                color: theme.colors.text,
                                            }}
                                            numberOfLines={1}
                                        >
                                            {review.userName}
                                        </Text>
                                        <Text
                                            style={{
                                                marginLeft: 6,
                                                fontSize: 12,
                                                color: theme.colors.muted,
                                            }}
                                        >
                                            {formatRelativeTime(review.createdAt)}
                                        </Text>
                                    </View>

                                    <Text
                                        style={{
                                            fontSize: 13,
                                            fontWeight: '600',
                                            color: theme.colors.text,
                                            marginBottom: 2,
                                        }}
                                        numberOfLines={1}
                                    >
                                        ⭐ {review.rating.toFixed(1)} • Review de{' '}
                                        {review.bookId}
                                    </Text>

                                    {review.title ? (
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: theme.colors.text,
                                                marginBottom: 2,
                                            }}
                                            numberOfLines={1}
                                        >
                                            {review.title}
                                        </Text>
                                    ) : null}

                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: theme.colors.muted,
                                        }}
                                        numberOfLines={2}
                                    >
                                        {review.text}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}