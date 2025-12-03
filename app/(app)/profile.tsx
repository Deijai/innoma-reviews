// app/(app)/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';

import { fetchAllBooks } from '../../services/booksService';
import { fetchAllReviews } from '../../services/reviewsService';
import type { Book } from '../../types/book';
import type { Review } from '../../types/review';

const READING_GOAL = 12; // meta de livros/ano (mock)

function ReadingChallengeRing({ progress }: { progress: number }) {
    const size = 120;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(progress, 1));
    const offset = circumference - circumference * clamped;

    return (
        <Svg width={size} height={size}>
            <Circle
                stroke="#E5E7EB"
                fill="transparent"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
            />
            <Circle
                stroke="#5D5FEF"
                fill="transparent"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
            />
        </Svg>
    );
}

export default function ProfileScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const [books, setBooks] = useState<Book[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                const [allBooks, allReviews] = await Promise.all([
                    fetchAllBooks(),
                    fetchAllReviews(),
                ]);

                if (!isMounted) return;
                setBooks(allBooks);
                setReviews(allReviews);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    const stats = useMemo(() => {
        const reading = books.filter((b) => b.status === 'reading');
        const want = books.filter((b) => b.status === 'want');
        const read = books.filter((b) => b.status === 'read');

        const pagesRead = books.reduce((sum, b) => {
            const pages = b.pages || 0;
            const current = Math.min(b.currentPage || 0, pages);
            return sum + current;
        }, 0);

        const totalReviews = reviews.length;

        return {
            readingCount: reading.length,
            wantCount: want.length,
            readCount: read.length,
            pagesRead,
            totalReviews,
        };
    }, [books, reviews]);

    const challengeProgress = useMemo(() => {
        if (READING_GOAL <= 0) return 0;
        return Math.min(stats.readCount / READING_GOAL, 1);
    }, [stats.readCount]);

    const highlights = useMemo(
        () => reviews.slice(0, 6),
        [reviews],
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 32,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Cabeçalho */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 20,
                    }}
                >
                    <View
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 999,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.colors.card,
                            marginRight: 12,
                        }}
                    >
                        <Ionicons
                            name="person-outline"
                            size={24}
                            color={theme.colors.text}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '700',
                                color: theme.colors.text,
                            }}
                        >
                            Você
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.colors.muted,
                            }}
                        >
                            Leitor do Lumina
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/(app)/settings')}
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 999,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.colors.card,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <Ionicons
                            name="settings-outline"
                            size={18}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>
                </View>

                {/* Loading simples */}
                {loading ? (
                    <Text
                        style={{
                            fontSize: 14,
                            color: theme.colors.muted,
                            marginBottom: 12,
                        }}
                    >
                        Carregando suas estatísticas...
                    </Text>
                ) : null}

                {/* Reading challenge */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 16,
                        borderRadius: 20,
                        backgroundColor: theme.colors.card,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        marginBottom: 20,
                    }}
                >
                    <View style={{ marginRight: 16 }}>
                        <ReadingChallengeRing progress={challengeProgress} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '700',
                                color: theme.colors.text,
                                marginBottom: 4,
                            }}
                        >
                            Desafio de leitura
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.colors.muted,
                                marginBottom: 8,
                            }}
                        >
                            Meta de {READING_GOAL} livros. Você já concluiu{' '}
                            <Text
                                style={{ fontWeight: '700', color: theme.colors.text }}
                            >
                                {stats.readCount}
                            </Text>
                            .
                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.muted,
                            }}
                        >
                            Páginas lidas (estimado):{' '}
                            <Text
                                style={{ fontWeight: '700', color: theme.colors.text }}
                            >
                                {stats.pagesRead}
                            </Text>
                        </Text>
                    </View>
                </View>

                {/* Stats */}
                <View
                    style={{
                        flexDirection: 'row',
                        marginBottom: 20,
                        gap: 10,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            padding: 12,
                            borderRadius: 16,
                            backgroundColor: theme.colors.card,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 12,
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
                            }}
                        >
                            {stats.readingCount}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            padding: 12,
                            borderRadius: 16,
                            backgroundColor: theme.colors.card,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.muted,
                                marginBottom: 4,
                            }}
                        >
                            Quero ler
                        </Text>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '800',
                                color: theme.colors.text,
                            }}
                        >
                            {stats.wantCount}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            padding: 12,
                            borderRadius: 16,
                            backgroundColor: theme.colors.card,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.muted,
                                marginBottom: 4,
                            }}
                        >
                            Lidos
                        </Text>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '800',
                                color: theme.colors.text,
                            }}
                        >
                            {stats.readCount}
                        </Text>
                    </View>
                </View>

                {/* Destaques (reviews) */}
                <View>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: theme.colors.text,
                            marginBottom: 10,
                        }}
                    >
                        Seus destaques
                    </Text>

                    {highlights.length === 0 ? (
                        <View
                            style={{
                                padding: 16,
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
                                Nada por aqui ainda
                            </Text>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: theme.colors.muted,
                                }}
                            >
                                Publique suas primeiras reviews para vê-las em destaque no seu
                                perfil.
                            </Text>
                        </View>
                    ) : (
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                gap: 10,
                            }}
                        >
                            {highlights.map((review, index) => (
                                <TouchableOpacity
                                    key={review.id + index.toString()}
                                    activeOpacity={0.9}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/review/comments',
                                            params: { id: review.bookId, reviewId: review.id },
                                        })
                                    }
                                    style={{
                                        width: '48%',
                                        padding: 10,
                                        borderRadius: 14,
                                        backgroundColor: theme.colors.card,
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: theme.colors.muted,
                                            marginBottom: 4,
                                        }}
                                        numberOfLines={1}
                                    >
                                        ⭐ {review.rating.toFixed(1)} • {review.bookId}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            fontWeight: '700',
                                            color: theme.colors.text,
                                            marginBottom: 2,
                                        }}
                                        numberOfLines={2}
                                    >
                                        {review.title || 'Review sem título'}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: theme.colors.muted,
                                        }}
                                        numberOfLines={3}
                                    >
                                        {review.text}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
