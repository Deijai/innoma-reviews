// app/(app)/discovery.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks/useTheme';
import { fetchAllBooks } from '../../services/booksService';
import type { Book } from '../../types/book';

export default function DiscoveryScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const [trending, setTrending] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            try {
                setLoading(true);
                // Carrega livros "em alta" via service (hoje: top N do resultado padrão da API)
                const all = await fetchAllBooks();
                if (!isMounted) return;

                setTrending(all.slice(0, 10));
            } catch (error) {
                console.log('Erro ao carregar livros de descoberta:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        load();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 32,
                    paddingHorizontal: 16,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View
                    style={{
                        paddingTop: 12,
                        paddingBottom: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.muted,
                            }}
                        >
                            Descubra novos mundos
                        </Text>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '700',
                                color: theme.colors.text,
                                marginTop: 2,
                            }}
                        >
                            Explorar livros
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push('/(app)/search')}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 999,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.colors.card,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <Ionicons
                            name="search-outline"
                            size={18}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>
                </View>

                {/* Em alta */}
                <View style={{ marginTop: 8 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: theme.colors.text,
                            marginBottom: 8,
                        }}
                    >
                        Em alta
                    </Text>

                    {loading && trending.length === 0 ? (
                        <View
                            style={{
                                padding: 16,
                                borderRadius: 16,
                                backgroundColor: theme.colors.card,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 12,
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
                                Buscando livros para você descobrir...
                            </Text>
                        </View>
                    ) : trending.length === 0 ? (
                        <View
                            style={{
                                padding: 12,
                                borderRadius: 16,
                                backgroundColor: theme.colors.card,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: theme.colors.muted,
                                }}
                            >
                                Ainda não encontramos livros para mostrar aqui.
                                Tente buscar por algum título na lupa.
                            </Text>
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingVertical: 4,
                                paddingRight: 8,
                                gap: 12,
                            }}
                        >
                            {trending.map((book) => (
                                <TouchableOpacity
                                    key={book.id}
                                    onPress={() =>
                                        router.push(`/book/${book.id}`)
                                    }
                                    activeOpacity={0.9}
                                    style={{
                                        width: 140,
                                        borderRadius: 16,
                                        backgroundColor: theme.colors.card,
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
                                        padding: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: '100%',
                                            height: 140,
                                            borderRadius: 10,
                                            backgroundColor:
                                                theme.colors.background,
                                            marginBottom: 8,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Ionicons
                                            name="book-outline"
                                            size={24}
                                            color={theme.colors.muted}
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            fontWeight: '600',
                                            color: theme.colors.text,
                                        }}
                                        numberOfLines={2}
                                    >
                                        {book.title}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: theme.colors.muted,
                                            marginTop: 2,
                                        }}
                                        numberOfLines={1}
                                    >
                                        {book.author}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
