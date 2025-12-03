// app/review/success.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

export default function ReviewSuccessScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { id, reviewId } = useLocalSearchParams<{
        id?: string;
        reviewId?: string;
    }>();

    function goToBook() {
        if (id) {
            router.replace(`/book/${id}`);
        } else {
            router.back();
        }
    }

    function goToComments() {
        if (!id) {
            router.back();
            return;
        }

        router.replace({
            pathname: '/review/comments',
            params: { id, reviewId },
        });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 32,
                }}
            >
                <View
                    style={{
                        width: 140,
                        height: 140,
                        borderRadius: 999,
                        marginBottom: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.colors.card,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                    }}
                >
                    <Ionicons
                        name="checkmark-circle"
                        size={72}
                        color={theme.colors.primary}
                    />
                </View>

                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: '800',
                        textAlign: 'center',
                        color: theme.colors.text,
                        marginBottom: 8,
                    }}
                >
                    Review publicada! 🎉
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        textAlign: 'center',
                        color: theme.colors.muted,
                        marginBottom: 24,
                    }}
                >
                    Outros leitores agora podem ver sua opinião e interagir com você.
                </Text>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={goToComments}
                    style={{
                        width: '100%',
                        paddingVertical: 14,
                        borderRadius: 999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.colors.primary,
                        marginBottom: 12,
                    }}
                >
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontWeight: '600',
                            fontSize: 15,
                        }}
                    >
                        Ver comentários
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={goToBook}
                    style={{
                        width: '100%',
                        paddingVertical: 12,
                        borderRadius: 999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.border,
                        borderWidth: 1,
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.text,
                            fontWeight: '600',
                            fontSize: 14,
                        }}
                    >
                        Voltar para o livro
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
