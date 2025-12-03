// app/(app)/search.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookCoverPreview } from '../../components/ui/BookCoverPreview';
import { BOOKS } from '../../constants/mockData';
import { useTheme } from '../../hooks/useTheme';

export default function SearchScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { q } = useLocalSearchParams<{ q?: string }>();
    const query = (q ?? '').toString().trim().toLowerCase();

    const results = useMemo(() => {
        if (!query) return [];
        return BOOKS.filter((book) => {
            const text = `${book.title} ${book.author} ${book.tags.join(' ')}`.toLowerCase();
            return text.includes(query);
        });
    }, [query]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
                    <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: theme.colors.text,
                        }}
                    >
                        Resultados
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: 12,
                            color: theme.colors.muted,
                        }}
                    >
                        {query ? `Buscando por “${query}”` : 'Nenhum termo de busca informado'}
                    </Text>
                </View>
            </View>

            {/* Lista de resultados */}
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
                {query.length === 0 ? (
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                color: theme.colors.muted,
                                textAlign: 'center',
                            }}
                        >
                            Digite algo na tela de Descobrir para ver resultados aqui.
                        </Text>
                    </View>
                ) : results.length === 0 ? (
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
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
                            Nenhum resultado encontrado
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: theme.colors.muted,
                                textAlign: 'center',
                            }}
                        >
                            Tente usar termos diferentes ou mais genéricos.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 24 }}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => router.push(`/book/${item.id}`)}
                            >
                                <BookCoverPreview
                                    title={item.title}
                                    author={item.author}
                                    compact
                                />
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
