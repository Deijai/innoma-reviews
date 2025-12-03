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

export default function CommentsScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { id, reviewId } = useLocalSearchParams<{
        id?: string;
        reviewId?: string;
    }>();

    const [text, setText] = useState('');

    const reviews = useReviewsStore((s) => s.reviews);
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

    const comments = review?.comments ?? [];

    function handleBack() {
        router.back();
    }

    function handleSend() {
        if (!review || !id) return;
        if (!text.trim()) return;

        addComment({
            reviewId: review.id,
            bookId: id.toString(),
            userName: 'Você',
            text,
        });

        setText('');
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

                {/* Lista de comentários ou empty-state */}
                {(!review || comments.length === 0) ? (
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
                        data={comments}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingBottom: 80,
                            paddingTop: 8,
                        }}
                        inverted
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderRadius: 16,
                                    marginBottom: 8,
                                    backgroundColor: theme.colors.card,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: '700',
                                        color: theme.colors.text,
                                        marginBottom: 2,
                                    }}
                                >
                                    {item.userName}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: theme.colors.muted,
                                        marginBottom: 4,
                                    }}
                                >
                                    {item.text}
                                </Text>
                            </View>
                        )}
                    />
                )}

                {/* Input fixo embaixo */}
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
                            placeholder="Adicionar comentário..."
                            placeholderTextColor={theme.colors.muted}
                            style={{
                                flex: 1,
                                fontSize: 14,
                                color: theme.colors.text,
                            }}
                        />
                        <TouchableOpacity onPress={handleSend} disabled={!text.trim() || !review}>
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
