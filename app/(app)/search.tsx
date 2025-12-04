// app/(app)/search.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks/useTheme';
import { searchBooksByQuery } from '../../services/booksService';
import type { Book } from '../../types/book';

const PAGE_SIZE = 20;

export default function SearchScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Book[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const canSearch = query.trim().length > 0 && !loading;

    const performSearch = useCallback(
        async (resetPage = true) => {
            if (!query.trim()) return;

            try {
                if (resetPage) {
                    setLoading(true);
                    setResults([]);
                    setPage(1);
                } else {
                    setLoadingMore(true);
                }

                setError(null);
                setHasSearched(true);

                const currentPage = resetPage ? 1 : page + 1;
                const data = await searchBooksByQuery(
                    query.trim(),
                    currentPage,
                    PAGE_SIZE,
                );

                console.log('data ', data);


                if (resetPage) {
                    setResults(data);
                } else {
                    setResults((prev) => [...prev, ...data]);
                    setPage(currentPage);
                }

                setHasMore(data.length === PAGE_SIZE);
            } catch (err) {
                console.log('Erro ao buscar livros:', err);
                setError('Não foi possível carregar os livros. Tente novamente.');
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [query, page],
    );

    function handleSearchSubmit() {
        Keyboard.dismiss();
        if (!canSearch) return;
        performSearch(true);
    }

    function handleLoadMore() {
        if (!hasMore || loading || loadingMore) return;
        performSearch(false);
    }

    function renderHeader() {
        return (
            <View
                style={{
                    paddingHorizontal: 16,
                    paddingTop: 12,
                    paddingBottom: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
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
                    <Ionicons
                        name="chevron-back"
                        size={18}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>

                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: theme.colors.card,
                        borderRadius: 999,
                        paddingHorizontal: 12,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                    }}
                >
                    <Ionicons
                        name="search-outline"
                        size={18}
                        color={theme.colors.muted}
                        style={{ marginRight: 8 }}
                    />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Buscar por título, autor, ISBN..."
                        placeholderTextColor={theme.colors.muted}
                        style={{
                            flex: 1,
                            paddingVertical: 8,
                            color: theme.colors.text,
                            fontSize: 14,
                        }}
                        returnKeyType="search"
                        onSubmitEditing={handleSearchSubmit}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setQuery('');
                                setResults([]);
                                setHasSearched(false);
                                setError(null);
                            }}
                            style={{ padding: 4 }}
                        >
                            <Ionicons
                                name="close-circle"
                                size={16}
                                color={theme.colors.muted}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    onPress={handleSearchSubmit}
                    disabled={!canSearch}
                    style={{
                        marginLeft: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 999,
                        backgroundColor: canSearch
                            ? theme.colors.primary
                            : theme.colors.border,
                    }}
                    activeOpacity={0.85}
                >
                    <Text
                        style={{
                            color: canSearch
                                ? theme.colors.primarySoft
                                : theme.colors.muted,
                            fontSize: 13,
                            fontWeight: '600',
                        }}
                    >
                        Buscar
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    function renderItem({ item }: { item: Book }) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push(`/book/${item.id}`)}
                style={{
                    flexDirection: 'row',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                    backgroundColor: theme.colors.background,
                }}
            >
                <View
                    style={{
                        width: 54,
                        height: 80,
                        borderRadius: 8,
                        backgroundColor: theme.colors.card,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                        overflow: 'hidden',
                    }}
                >
                    {item.coverUrl ? (
                        <View
                            style={{
                                flex: 1,
                                width: '100%',
                                backgroundColor: theme.colors.card,
                            }}
                        >
                            {/* Usando Image via require dinâmico seria outro passo;
                               aqui deixo a view para você plugar a Image se já usar em outro lugar */}
                        </View>
                    ) : (
                        <Ionicons
                            name="book-outline"
                            size={22}
                            color={theme.colors.muted}
                        />
                    )}
                </View>

                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '600',
                            color: theme.colors.text,
                            marginBottom: 2,
                        }}
                        numberOfLines={2}
                    >
                        {item.title}
                    </Text>
                    <Text
                        style={{
                            fontSize: 13,
                            color: theme.colors.muted,
                            marginBottom: 4,
                        }}
                        numberOfLines={1}
                    >
                        {item.author}
                    </Text>
                    {item.pages ? (
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.muted,
                            }}
                        >
                            {item.pages} páginas
                        </Text>
                    ) : null}
                </View>
            </TouchableOpacity>
        );
    }

    function renderListEmpty() {
        if (loading) {
            return (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 40,
                    }}
                >
                    <ActivityIndicator
                        size="small"
                        color={theme.colors.primary}
                    />
                    <Text
                        style={{
                            marginTop: 8,
                            color: theme.colors.muted,
                            fontSize: 13,
                        }}
                    >
                        Buscando livros...
                    </Text>
                </View>
            );
        }

        if (error) {
            return (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 40,
                        paddingHorizontal: 32,
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.danger,
                            textAlign: 'center',
                        }}
                    >
                        {error}
                    </Text>
                </View>
            );
        }

        if (!hasSearched) {
            return (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 40,
                        paddingHorizontal: 32,
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.muted,
                            textAlign: 'center',
                        }}
                    >
                        Comece digitando um título, autor ou ISBN para buscar
                        livros.
                    </Text>
                </View>
            );
        }

        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 40,
                }}
            >
                <Text
                    style={{
                        color: theme.colors.muted,
                        textAlign: 'center',
                    }}
                >
                    Nenhum livro encontrado para sua pesquisa.
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            {renderHeader()}

            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={renderListEmpty}
                contentContainerStyle={{
                    paddingBottom: 24,
                }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.6}
                ListFooterComponent={
                    loadingMore ? (
                        <View
                            style={{
                                paddingVertical: 12,
                                alignItems: 'center',
                            }}
                        >
                            <ActivityIndicator
                                size="small"
                                color={theme.colors.primary}
                            />
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}
