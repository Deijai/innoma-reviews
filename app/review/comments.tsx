// app/review/comments.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useReviewsStore } from '../../stores/reviewsStore';
import type { Comment as CommentType } from '../../types/comment';

export default function CommentsScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { id, reviewId } = useLocalSearchParams<{
        id?: string;
        reviewId?: string;
    }>();

    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState<CommentType | null>(null);

    const reviews = useReviewsStore((s) => s.reviews);
    const commentsState = useReviewsStore((s) => s.comments);
    const addComment = useReviewsStore((s) => s.addComment);

    const review = useMemo(() => {
        if (reviewId) {
            return reviews.find((r) => r.id === reviewId);
        }
        if (id) {
            return reviews.find((r) => r.bookId === id);
        }
        return undefined;
    }, [reviews, id, reviewId]);

    const comments: CommentType[] = useMemo(() => {
        if (!review) return [];
        return commentsState.filter((c) => c.reviewId === review.id);
    }, [commentsState, review]);

    const topLevelComments = comments.filter((c) => !c.parentCommentId);

    const childrenByParent = useMemo(() => {
        const map = new Map<string, CommentType[]>();
        comments.forEach((c) => {
            if (c.parentCommentId) {
                if (!map.has(c.parentCommentId)) {
                    map.set(c.parentCommentId, []);
                }
                map.get(c.parentCommentId)!.push(c);
            }
        });
        return map;
    }, [comments]);

    function handleBack() {
        router.back();
    }

    function handleSend() {
        if (!review) return;
        if (!text.trim()) return;

        addComment({
            reviewId: review.id,
            bookId: (id ?? review.bookId).toString(),
            userName: 'Você',
            text,
            parentCommentId: replyTo?.id ?? null,
        });

        setText('');
        setReplyTo(null);
    }

    function renderCommentItem(item: CommentType, depth: number = 0) {
        const children = childrenByParent.get(item.id) ?? [];
        const isReply = depth > 0;

        return (
            <View key={item.id} style={{ marginBottom: 8 }}>
                <View
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 16,
                        backgroundColor: isReply
                            ? theme.colors.background
                            : theme.colors.card,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        marginLeft: isReply ? 32 : 0,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 2,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '700',
                                color: theme.colors.text,
                            }}
                        >
                            {item.userName}
                        </Text>
                        <Text
                            style={{
                                marginLeft: 6,
                                fontSize: 11,
                                color: theme.colors.muted,
                            }}
                        >
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>

                    <Text
                        style={{
                            fontSize: 13,
                            color: theme.colors.muted,
                            marginBottom: 6,
                        }}
                    >
                        {item.text}
                    </Text>

                    {!isReply && (
                        <TouchableOpacity
                            onPress={() => setReplyTo(item)}
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                            <Ionicons
                                name="chatbubble-ellipses-outline"
                                size={14}
                                color={theme.colors.primary}
                                style={{ marginRight: 4 }}
                            />
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: '600',
                                    color: theme.colors.primary,
                                }}
                            >
                                Responder
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {children.length > 0 && (
                    <View style={{ marginTop: 4 }}>
                        {children.map((child) => renderCommentItem(child, depth + 1))}
                    </View>
                )}
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header simples */}
                <View
                    style={{
                        paddingHorizontal: 16,
                        paddingTop: 10,
                        paddingBottom: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={handleBack}
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 999,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.colors.card,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            marginRight: 8,
                        }}
                    >
                        <Ionicons name="chevron-down" size={18} color={theme.colors.text} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '700',
                                color: theme.colors.text,
                            }}
                        >
                            Comentários
                        </Text>
                        {review && (
                            <Text
                                numberOfLines={1}
                                style={{
                                    fontSize: 12,
                                    color: theme.colors.muted,
                                }}
                            >
                                {review.title || 'Review deste livro'}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Lista */}
                {(!review || topLevelComments.length === 0) ? (
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 24,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '700',
                                color: theme.colors.text,
                                marginBottom: 6,
                            }}
                        >
                            Nenhum comentário ainda
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: theme.colors.muted,
                                textAlign: 'center',
                            }}
                        >
                            Seja o primeiro a comentar sobre essa review.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={topLevelComments}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingBottom: 80,
                            paddingTop: 8,
                        }}
                        renderItem={({ item }) => renderCommentItem(item, 0)}
                    />
                )}

                {/* Input fixo + contexto de resposta */}
                <View
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderTopWidth: 1,
                        borderTopColor: theme.colors.border,
                        backgroundColor: theme.colors.card,
                    }}
                >
                    {replyTo && (
                        <View
                            style={{
                                marginBottom: 6,
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                borderRadius: 999,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: theme.colors.background,
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
                                <Text style={{ fontWeight: '600', color: theme.colors.text }}>
                                    {replyTo.userName}
                                </Text>
                            </Text>
                            <TouchableOpacity onPress={() => setReplyTo(null)}>
                                <Ionicons
                                    name="close-circle"
                                    size={18}
                                    color={theme.colors.muted}
                                />
                            </TouchableOpacity>
                        </View>
                    )}

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 999,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            backgroundColor: theme.colors.background,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <TextInput
                            value={text}
                            onChangeText={setText}
                            placeholder={
                                replyTo ? 'Responder comentário...' : 'Adicionar comentário...'
                            }
                            placeholderTextColor={theme.colors.muted}
                            style={{
                                flex: 1,
                                fontSize: 14,
                                color: theme.colors.text,
                            }}
                        />
                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={!text.trim() || !review}
                        >
                            <Ionicons
                                name="arrow-up-circle"
                                size={26}
                                color={
                                    text.trim() && review
                                        ? theme.colors.primary
                                        : theme.colors.muted
                                }
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
