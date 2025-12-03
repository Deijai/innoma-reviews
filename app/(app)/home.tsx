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

import {
    fetchAllBooks,
    updateBookProgress,
} from '../../services/booksService';
import { fetchRecentReviews } from '../../services/reviewsService';
import type { Book } from '../../types/book';
import type { Review } from '../../types/review';

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

    const [books, setBooks] = useState<Book[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Carrega livros + reviews recentes via services
    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                const [allBooks, recent] = await Promise.all([
                    fetchAllBooks(),
                    fetchRecentReviews(5),
                ]);

                if (!isMounted) return;

                setBooks(allBooks);
                setReviews(recent);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    const { currentlyReading, recommended, booksById } = useMemo(() => {
        if (!books.length) {
            return {
                currentlyReading: undefined as Book | undefined,
                recommended: [] as Book[],
                booksById: {} as Record<string, Book>,
            };
        }

        const reading =
            books.find((b) => b.status === 'reading') ?? books[0];

        const recs = books
            .filter((b) => !reading || b.id !== reading.id)
            .slice(0, 5);

        const map: Record<string, Book> = {};
        for (const b of books) {
            map[b.id] = b;
        }

        return { currentlyReading: reading, recommended: recs, booksById: map };
    }, [books]);

    const recentReviews = reviews;

    async function handleQuickRead() {
        if (!currentlyReading) return;
        if (!currentlyReading.pages) return;

        const nextPage = Math.min(
            currentlyReading.currentPage + 10,
            currentlyReading.pages,
        );

        await updateBookProgress(currentlyReading.id, nextPage);

        // Atualiza o estado local para refletir na UI imediatamente
        setBooks((prev) =>
            prev.map((b) =>
                b.id === currentlyReading.id
                    ? { ...b, currentPage: nextPage }
                    : b,
            ),
        );
    }

    if (loading) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: theme.colors.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </SafeAreaView>
        );
    }

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
                        Continue o que está lendo, descubra novos títulos e veja o que a
                        comunidade está comentando.
                    </Text>
                </View>

                {/* Bloco: Lendo agora */}
                {currentlyReading && (
                    <View
                        style={{
                            padding: 16,
                            borderRadius: 20,
                            marginBottom: 24,
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
                                        fontSize: 12,
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                        color: theme.colors.muted,
                                        marginBottom: 4,
                                    }}
                                >
                                    Lendo agora
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: '800',
                                        color: theme.colors.text,
                                        marginBottom: 2,
                                    }}
                                    numberOfLines={1}
                                >
                                    {currentlyReading.title}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: theme.colors.muted,
                                    }}
                                    numberOfLines={1}
                                >
                                    {currentlyReading.author}
                                </Text>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() =>
                                    router.push(`/book/${currentlyReading.id}`)
                                }
                            >
                                <BookCoverPreview
                                    title={currentlyReading.title}
                                    author={currentlyReading.author}
                                    compact
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Progresso */}
                        {currentlyReading.pages > 0 && (
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
                                            width: `${Math.round(
                                                (currentlyReading.currentPage /
                                                    currentlyReading.pages) *
                                                100,
                                            )}%`,
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
                                        {currentlyReading.currentPage}
                                    </Text>{' '}
                                    de{' '}
                                    <Text
                                        style={{
                                            fontWeight: '700',
                                            color: theme.colors.text,
                                        }}
                                    >
                                        {currentlyReading.pages}
                                    </Text>
                                </Text>
                            </View>
                        )}

                        {/* Ações rápidas */}
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <View style={{ flex: 1 }}>
                                <PrimaryButton
                                    title="Registrar leitura"
                                    onPress={() => router.push('/(app)/log-reading')}
                                    style={{ width: '100%' }}
                                />
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() =>
                                    router.push(`/book/${currentlyReading.id}`)
                                }
                                style={{
                                    width: 48,
                                    height: 48,
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
                                    size={20}
                                    color={theme.colors.text}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Bloco: Recomendados */}
                {recommended.length > 0 && (
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
                                onPress={() => router.push('/(app)/discovery')}
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

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                {recommended.map((book, index) => (
                                    <BookCoverPreview
                                        key={book.id + index.toString()}
                                        title={book.title}
                                        author={book.author}
                                        compact
                                        onPress={() => router.push(`/book/${book.id}`)}
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                )}

                {/* Bloco: Atividade da comunidade */}
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

                    {recentReviews.length === 0 ? (
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
                                Publique a sua primeira review para começar a movimentar o
                                feed.
                            </Text>
                            <PrimaryButton
                                title="Escrever uma review"
                                onPress={() => {
                                    if (currentlyReading) {
                                        router.push({
                                            pathname: '/review/write',
                                            params: { id: currentlyReading.id },
                                        });
                                    } else if (books[0]) {
                                        router.push({
                                            pathname: '/review/write',
                                            params: { id: books[0].id },
                                        });
                                    }
                                }}
                            />
                        </View>
                    ) : (
                        recentReviews.map((review) => {
                            const bookTitle =
                                booksById[review.bookId]?.title ?? 'Livro';

                            return (
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
                                            params: { id: review.bookId, reviewId: review.id },
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
                                        ⭐ {review.rating.toFixed(1)} • Review de {bookTitle}
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
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
