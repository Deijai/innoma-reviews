// app/review/write.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookCoverPreview } from '../../components/ui/BookCoverPreview';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { StarRatingInput } from '../../components/ui/StarRatingInput';
import { useTheme } from '../../hooks/useTheme';

import { createReview } from '../../services/reviewsService';
import { useAuthStore } from '../../stores/authStore';
import { useBooksStore } from '../../stores/booksStore';

export default function WriteReviewScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const books = useBooksStore((s) => s.books);
    const user = useAuthStore((s) => s.user);

    const book = useMemo(
        () => books.find((b) => b.id === id),
        [books, id],
    );

    const [rating, setRating] = useState(4);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [spoilers, setSpoilers] = useState(false);
    const [loading, setLoading] = useState(false);

    const canPublish = !!book && !!user && body.trim().length > 0 && !loading;

    async function handlePublish() {
        if (!book || !user) return;
        if (!body.trim()) return;

        setLoading(true);

        try {
            const review = await createReview({
                bookId: book.id,
                rating,
                title,
                text: body,
                containsSpoilers: spoilers,
            });

            router.replace({
                pathname: '/review/comments',
                params: { id: book.id, reviewId: review.id },
            });
        } catch (e) {
            console.log('Erro ao criar review:', e);
        } finally {
            setLoading(false);
        }
    }

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
                        Escrever review
                    </Text>
                </View>

                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 24,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Livro sendo avaliado */}
                    {book ? (
                        <View
                            style={{
                                marginTop: 12,
                                marginBottom: 16,
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
                            />
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: '600',
                                        color: theme.colors.muted,
                                        marginBottom: 2,
                                    }}
                                >
                                    Review para:
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
                    ) : (
                        <View
                            style={{
                                marginTop: 12,
                                marginBottom: 16,
                                padding: 12,
                                borderRadius: 16,
                                backgroundColor: theme.colors.card,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: theme.colors.text,
                                }}
                            >
                                Livro não encontrado.
                            </Text>
                        </View>
                    )}

                    {/* Rating */}
                    <View
                        style={{
                            marginBottom: 16,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '700',
                                color: theme.colors.text,
                                marginBottom: 6,
                            }}
                        >
                            Sua nota
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.colors.muted,
                                marginBottom: 8,
                            }}
                        >
                            O quanto você recomenda este livro?
                        </Text>

                        <StarRatingInput
                            value={rating}
                            onChange={setRating}
                        />
                    </View>

                    {/* Título da review */}
                    <View style={{ marginBottom: 12 }}>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '700',
                                color: theme.colors.text,
                                marginBottom: 6,
                            }}
                        >
                            Título (opcional)
                        </Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Ex: Uma leitura transformadora"
                            placeholderTextColor={theme.colors.muted}
                            style={{
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                fontSize: 14,
                                color: theme.colors.text,
                                backgroundColor: theme.colors.card,
                            }}
                        />
                    </View>

                    {/* Corpo da review */}
                    <View style={{ marginBottom: 12 }}>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '700',
                                color: theme.colors.text,
                                marginBottom: 6,
                            }}
                        >
                            O que você achou?
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.colors.muted,
                                marginBottom: 6,
                            }}
                        >
                            Compartilhe o que mais gostou, o que te incomodou e
                            para quem você indicaria.
                        </Text>

                        <TextInput
                            value={body}
                            onChangeText={setBody}
                            placeholder="Escreva sua opinião aqui..."
                            placeholderTextColor={theme.colors.muted}
                            style={{
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                fontSize: 14,
                                color: theme.colors.text,
                                backgroundColor: theme.colors.card,
                                minHeight: 120,
                                textAlignVertical: 'top',
                            }}
                            multiline
                        />
                    </View>

                    {/* Spoilers */}
                    <View
                        style={{
                            marginBottom: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '700',
                                    color: theme.colors.text,
                                    marginBottom: 2,
                                }}
                            >
                                Contém spoilers?
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: theme.colors.muted,
                                }}
                            >
                                Ative se você revelar detalhes importantes da
                                história.
                            </Text>
                        </View>
                        <Switch
                            value={spoilers}
                            onValueChange={setSpoilers}
                            trackColor={{
                                true: theme.colors.primary,
                                false: theme.colors.border,
                            }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    {/* Botão publicar */}
                    <PrimaryButton
                        title={
                            !user
                                ? 'Entre para publicar'
                                : loading
                                    ? 'Publicando...'
                                    : 'Publicar review'
                        }
                        disabled={!canPublish}
                        onPress={
                            !user
                                ? () => router.push('/(auth)/sign-in')
                                : handlePublish
                        }
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
