// app/(app)/search.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

import { fetchAllBooks } from '../../services/booksService';
import type { Book } from '../../types/book';

export default function SearchScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { q } = useLocalSearchParams<{ q?: string }>();

    const [search, setSearch] = useState(q ? String(q) : '');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                const all = await fetchAllBooks();
                if (!isMounted) return;
                setBooks(all);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredBooks = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return [];
        return books.filter((book) => {
            const tags = book.tags ?? [];
            return (
                book.title.toLowerCase().includes(term) ||
                book.author.toLowerCase().includes(term) ||
                tags.some((t) => t.toLowerCase().includes(term))
            );
        });
    }, [search, books]);

    const renderItem = ({ item }: { item: Book }) => (
        <TouchableOpacity
            onPress={() => router.push(`/book/${item.id}`)}
            style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
            }}
        >
            <Text
                style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: theme.colors.text,
                }}
            >
                {item.title}
            </Text>
            <Text
                style={{
                    fontSize: 13,
                    color: theme.colors.muted,
                    marginTop: 2,
                }}
            >
                {item.author}
            </Text>
        </TouchableOpacity>
    );

    const hasSearchTerm = !!search.trim();
    const hasResults = filteredBooks.length > 0;

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
            {/* Campo de busca */}
            <View
                style={{
                    paddingHorizontal: 16,
                    paddingTop: 12,
                    paddingBottom: 8,
                }}
            >
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Buscar livros, autores, gêneros..."
                    placeholderTextColor={theme.colors.muted}
                    autoCapitalize="none"
                    style={{
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        backgroundColor: theme.colors.card,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                        fontSize: 14,
                    }}
                />
            </View>

            {/* Loading simples */}
            {loading && (
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
                        }}
                    >
                        Carregando catálogo...
                    </Text>
                </View>
            )}

            {!loading && hasSearchTerm && !hasResults && (
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 40,
                            marginBottom: 12,
                        }}
                    >
                        🔍
                    </Text>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '700',
                            color: theme.colors.text,
                            marginBottom: 8,
                            textAlign: 'center',
                        }}
                    >
                        Nada encontrado
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: theme.colors.muted,
                            textAlign: 'center',
                            marginBottom: 16,
                        }}
                    >
                        Não encontramos resultados para "{search}". Tente buscar por outro
                        título, autor ou gênero.
                    </Text>

                    <TouchableOpacity
                        onPress={() => router.push('/(app)/discovery')}
                        style={{
                            paddingHorizontal: 18,
                            paddingVertical: 10,
                            borderRadius: 999,
                            backgroundColor: theme.colors.primary,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#FFFFFF',
                            }}
                        >
                            Voltar para Descobrir
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {!loading && hasSearchTerm && hasResults && (
                <FlatList
                    data={filteredBooks}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 20,
                    }}
                />
            )}

            {!loading && !hasSearchTerm && (
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
                            fontSize: 18,
                            fontWeight: '700',
                            color: theme.colors.text,
                            marginBottom: 8,
                            textAlign: 'center',
                        }}
                    >
                        Comece digitando algo
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: theme.colors.muted,
                            textAlign: 'center',
                        }}
                    >
                        Busque por um livro, autor ou gênero para ver os resultados aqui.
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}
