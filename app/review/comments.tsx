// app/review/comments.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookCoverPreview } from '../../components/ui/BookCoverPreview';
import { useTheme } from '../../hooks/useTheme';

import { useAuthStore } from '../../stores/authStore';
import { useBooksStore } from '../../stores/booksStore';
import { useReviewsStore } from '../../stores/reviewsStore';

import type { Comment as CommentType } from '../../types/comment';
import type { Review } from '../../types/review';

import {
    createComment,
    fetchCommentsForReview,
} from '../../services/commentsService';
import {
    fetchReviewById,
    fetchReviewsForBook,
} from '../../services/reviewsService';

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

export default function CommentsScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { id, reviewId } = useLocalSearchParams<{
        id?: string;
        reviewId?: string;
    }>();

    const user = useAuthStore((s) => s.user);

    const books = useBooksStore((s) => s.books);
    const reviews = useReviewsStore((s) => s.reviews);
    const commentsState = useReviewsStore((s) => s.comments);

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState<CommentType | null>(null);

    // Review em foco
    const review: Review | undefined = useMemo(() => {
        if (reviewId) {
            return reviews.find((r) => r.id === reviewId);
        }
        if (id) {
            // se só veio o bookId, pega a primeira review desse livro (se existir)
            return reviews.find((r) => r.bookId === id);
        }
        return undefined;
    }, [reviews, id, reviewId]);

    // Livro em foco
    const book = useMemo(() => {
        if (id) {
            return books.find((b) => b.id === id);
        }
        if (review) {
            return books.find((b) => b.id === review.bookId);
        }
        return undefined;
    }, [books, id, review]);

    // Comentários filtrados pela review atual
    const comments: CommentType[] = useMemo(() => {
        if (!review) return [];
        return commentsState.filter((c) => c.reviewId === review.id);
    }, [commentsState, review]);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                let currentReview = review;

                // Se não temos a review em memória, busca
                if (!currentReview && reviewId) {
                    currentReview = await fetchReviewById(reviewId);
                }

                // Se ainda não temos review mas temos bookId, carrega todas do livro e pega a primeira
                if (!currentReview && id) {
                    const bookReviews = await fetchReviewsForBook(id);
                    currentReview = bookReviews[0];
                }

                if (currentReview) {
                    await fetchCommentsForReview(currentReview.id);
                }
            } catch (e) {
                console.log('Erro ao carregar review/comentários:', e);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [reviewId, id]);

    async function handleSend() {
        if (!review) return;
        if (!text.trim()) return;
        if (!user) {
            // opcional: mandar para login
            // router.push('/(auth)/sign-in');
            return;
        }

        setSending(true);

        try {
            await createComment({
                reviewId: review.id,
                bookId: book?.id ?? review.bookId,
                text,
                parentCommentId: replyTo?.id ?? null,
            });

            setText('');
            setReplyTo(null);
        } catch (e) {
            console.log('Erro ao criar comentário', e);
        } finally {
            setSending(false);
        }
    }

    const canSend = !!review && !!user && text.trim().length > 0 && !sending;

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingTop: 12,
                        paddingBottom: 8,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 999,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.colors.card,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            marginRight: 8,
                        }}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={20}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>
                    <Text
                        numberOfLines={1}
                        style={{
                            flex: 1,
                            fontSize: 16,
                            fontWeight: '700',
                            color: theme.colors.text,
                        }}
                    >
                        Comentários
                    </Text>
                </View>

                {/* Conteúdo principal */}
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 16,
                        paddingBottom: 8,
                    }}
                >
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 16 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Livro em destaque */}
                        {book && (
                            <View
                                style={{
                                    marginTop: 4,
                                    marginBottom: 12,
                                    padding: 12,
                                    borderRadius: 16,
                                    backgroundColor: theme.colors.card,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 12,
                                }}
                            >
                                <BookCoverPreview
                                    title={book.title}
                                    author={book.author}
                                    compact
                                    onPress={() =>
                                        router.push(`/book/${book.id}`)
                                    }
                                />
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: theme.colors.muted,
                                            marginBottom: 2,
                                        }}
                                    >
                                        Comentando o livro:
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: '700',
                                            color: theme.colors.text,
                                        }}
                                        numberOfLines={2}
                                    >
                                        {book.title}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: theme.colors.muted,
                                            marginTop: 2,
                                        }}
                                        numberOfLines={1}
                                    >
                                        {book.author}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Review em destaque */}
                        {review ? (
                            <View
                                style={{
                                    marginBottom: 16,
                                    padding: 12,
                                    borderRadius: 16,
                                    backgroundColor: theme.colors.card,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 6,
                                    }}
                                >
                                    <Ionicons
                                        name="person-circle-outline"
                                        size={22}
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

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 4,
                                    }}
                                >
                                    <Ionicons
                                        name="star"
                                        size={14}
                                        color="#FACC15"
                                    />
                                    <Text
                                        style={{
                                            marginLeft: 4,
                                            fontSize: 13,
                                            fontWeight: '600',
                                            color: theme.colors.text,
                                        }}
                                    >
                                        {review.rating.toFixed(1)} / 5
                                    </Text>
                                    {review.containsSpoilers && (
                                        <View
                                            style={{
                                                marginLeft: 8,
                                                paddingHorizontal: 8,
                                                paddingVertical: 2,
                                                borderRadius: 999,
                                                backgroundColor:
                                                    theme.colors.background,
                                                borderWidth: 1,
                                                borderColor:
                                                    theme.colors.border,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 11,
                                                    color: theme.colors.muted,
                                                }}
                                            >
                                                Contém spoilers
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {review.title ? (
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '700',
                                            color: theme.colors.text,
                                            marginBottom: 2,
                                        }}
                                    >
                                        {review.title}
                                    </Text>
                                ) : null}

                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: theme.colors.muted,
                                        lineHeight: 20,
                                    }}
                                >
                                    {review.text}
                                </Text>
                            </View>
                        ) : loading ? (
                            <View
                                style={{
                                    paddingVertical: 24,
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: theme.colors.muted,
                                    }}
                                >
                                    Carregando review...
                                </Text>
                            </View>
                        ) : (
                            <View
                                style={{
                                    paddingVertical: 24,
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: theme.colors.muted,
                                    }}
                                >
                                    Review não encontrada.
                                </Text>
                            </View>
                        )}

                        {/* Lista de comentários */}
                        <View style={{ marginBottom: 8 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '700',
                                    color: theme.colors.text,
                                    marginBottom: 8,
                                }}
                            >
                                Comentários
                            </Text>

                            {loading ? (
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: theme.colors.muted,
                                    }}
                                >
                                    Carregando comentários...
                                </Text>
                            ) : comments.length === 0 ? (
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: theme.colors.muted,
                                    }}
                                >
                                    Ainda não há comentários. Seja o primeiro a
                                    comentar!
                                </Text>
                            ) : (
                                <FlatList
                                    data={comments}
                                    keyExtractor={(c) => c.id}
                                    scrollEnabled={false}
                                    ItemSeparatorComponent={() => (
                                        <View style={{ height: 8 }} />
                                    )}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            activeOpacity={0.85}
                                            onPress={() =>
                                                setReplyTo(
                                                    replyTo?.id === item.id
                                                        ? null
                                                        : item,
                                                )
                                            }
                                            style={{
                                                padding: 10,
                                                borderRadius: 12,
                                                backgroundColor:
                                                    replyTo?.id === item.id
                                                        ? theme.colors
                                                            .background
                                                        : theme.colors.card,
                                                borderWidth: 1,
                                                borderColor:
                                                    theme.colors.border,
                                            }}
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
                                                    size={18}
                                                    color={theme.colors.muted}
                                                    style={{
                                                        marginRight: 4,
                                                    }}
                                                />
                                                <Text
                                                    style={{
                                                        fontSize: 13,
                                                        fontWeight: '600',
                                                        color: theme.colors
                                                            .text,
                                                    }}
                                                    numberOfLines={1}
                                                >
                                                    {item.userName}
                                                </Text>
                                                <Text
                                                    style={{
                                                        marginLeft: 6,
                                                        fontSize: 11,
                                                        color: theme.colors
                                                            .muted,
                                                    }}
                                                >
                                                    {formatRelativeTime(
                                                        item.createdAt,
                                                    )}
                                                </Text>
                                            </View>

                                            {item.parentCommentId && (
                                                <Text
                                                    style={{
                                                        fontSize: 11,
                                                        color: theme.colors
                                                            .muted,
                                                        marginBottom: 2,
                                                    }}
                                                >
                                                    Respondendo a{' '}
                                                    <Text
                                                        style={{
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        #
                                                        {
                                                            comments.find(
                                                                (c) =>
                                                                    c.id ===
                                                                    item.parentCommentId,
                                                            )?.userName
                                                        }
                                                    </Text>
                                                </Text>
                                            )}

                                            <Text
                                                style={{
                                                    fontSize: 13,
                                                    color: theme.colors.muted,
                                                }}
                                            >
                                                {item.text}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            )}
                        </View>
                    </ScrollView>

                    {/* Caixa de novo comentário */}
                    <View
                        style={{
                            borderTopWidth: 1,
                            borderTopColor: theme.colors.border,
                            paddingTop: 8,
                            paddingBottom: 10,
                        }}
                    >
                        {replyTo && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 6,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: theme.colors.muted,
                                        flex: 1,
                                    }}
                                    numberOfLines={1}
                                >
                                    Respondendo a{' '}
                                    <Text
                                        style={{
                                            fontWeight: '600',
                                            color: theme.colors.text,
                                        }}
                                    >
                                        {replyTo.userName}
                                    </Text>
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setReplyTo(null)}
                                >
                                    <Ionicons
                                        name="close-circle"
                                        size={16}
                                        color={theme.colors.muted}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                gap: 8,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    borderRadius: 999,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    backgroundColor: theme.colors.card,
                                    paddingHorizontal: 12,
                                    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
                                }}
                            >
                                <TextInput
                                    value={text}
                                    onChangeText={setText}
                                    placeholder={
                                        user
                                            ? 'Escreva um comentário...'
                                            : 'Entre para comentar'
                                    }
                                    placeholderTextColor={theme.colors.muted}
                                    style={{
                                        fontSize: 14,
                                        color: theme.colors.text,
                                        maxHeight: 90,
                                    }}
                                    multiline
                                />
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={
                                    !user
                                        ? () =>
                                            router.push('/(auth)/sign-in')
                                        : handleSend
                                }
                                disabled={!canSend}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 999,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: canSend
                                        ? theme.colors.primary
                                        : theme.colors.border,
                                }}
                            >
                                <Ionicons
                                    name="send"
                                    size={18}
                                    color={
                                        canSend
                                            ? theme.colors.primarySoft
                                            : theme.colors.muted
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
