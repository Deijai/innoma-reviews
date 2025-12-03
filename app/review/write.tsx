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
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { StarRatingInput } from '../../components/ui/StarRatingInput';
import { BOOKS } from '../../constants/mockData';
import { useTheme } from '../../hooks/useTheme';
import { useReviewsStore } from '../../stores/reviewsStore';

export default function WriteReviewScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const book = useMemo(() => BOOKS.find((b) => b.id === id), [id]);
    const addReview = useReviewsStore((s) => s.addReview);

    const [rating, setRating] = useState(4);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [spoilers, setSpoilers] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleClose() {
        router.back();
    }

    async function handlePublish() {
        if (!book) return;
        if (!body.trim()) return; // simples validação

        setLoading(true);

        const reviewId = addReview({
            bookId: book.id,
            userName: 'Você', // mock – depois ligamos no usuário real
            rating,
            title,
            body,
            hasSpoilers: spoilers,
        });

        setLoading(false);

        router.replace({
            pathname: '/review/success',
            params: { id: book.id, reviewId },
        });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header modal */}
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
                        onPress={handleClose}
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
                        <Ionicons name="close" size={18} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: theme.colors.text,
                        }}
                    >
                        Escrever review
                    </Text>
                </View>

                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 24,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Livro */}
                    {book && (
                        <View
                            style={{
                                padding: 12,
                                borderRadius: 16,
                                marginBottom: 16,
                                backgroundColor: theme.colors.card,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: '600',
                                    color: theme.colors.muted,
                                    marginBottom: 4,
                                }}
                            >
                                Review para
                            </Text>
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: '700',
                                    color: theme.colors.text,
                                }}
                            >
                                {book.title}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: theme.colors.muted,
                                    marginTop: 2,
                                }}
                            >
                                {book.author}
                            </Text>
                        </View>
                    )}

                    {/* Rating */}
                    <View style={{ marginBottom: 16 }}>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: theme.colors.text,
                                marginBottom: 4,
                            }}
                        >
                            Sua nota
                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.muted,
                                marginBottom: 8,
                            }}
                        >
                            Toque nas estrelas para avaliar de 1 a 5.
                        </Text>
                        <StarRatingInput value={rating} onChange={setRating} />
                    </View>

                    {/* Título */}
                    <View style={{ marginBottom: 12 }}>
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: theme.colors.text,
                                marginBottom: 6,
                            }}
                        >
                            Título da review
                        </Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Ex.: Um clássico indispensável..."
                            placeholderTextColor={theme.colors.muted}
                            style={{
                                borderRadius: 12,
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                backgroundColor: theme.colors.card,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                fontSize: 14,
                                color: theme.colors.text,
                            }}
                        />
                    </View>

                    {/* Corpo */}
                    <View style={{ marginBottom: 16 }}>
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: theme.colors.text,
                                marginBottom: 6,
                            }}
                        >
                            Review
                        </Text>
                        <TextInput
                            value={body}
                            onChangeText={setBody}
                            multiline
                            numberOfLines={6}
                            placeholder="Compartilhe sua opinião, pontos fortes, fracos, como o livro impactou você..."
                            placeholderTextColor={theme.colors.muted}
                            textAlignVertical="top"
                            style={{
                                borderRadius: 16,
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                backgroundColor: theme.colors.card,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                fontSize: 14,
                                color: theme.colors.text,
                                minHeight: 140,
                            }}
                        />
                    </View>

                    {/* Spoilers */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 24,
                        }}
                    >
                        <View style={{ flex: 1, marginRight: 12 }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: '600',
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
                                Se marcado, vamos ocultar alguns trechos para outros leitores.
                            </Text>
                        </View>
                        <Switch
                            value={spoilers}
                            onValueChange={setSpoilers}
                            thumbColor="#FFFFFF"
                            trackColor={{
                                true: theme.colors.primary,
                                false: theme.colors.border,
                            }}
                        />
                    </View>

                    <PrimaryButton
                        title="Publicar review"
                        onPress={handlePublish}
                        loading={loading}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
