// app/(app)/discovery.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookCoverPreview } from '../../components/ui/BookCoverPreview';
import { useTheme } from '../../hooks/useTheme';

import { fetchAllBooks } from '../../services/booksService';
import type { Book } from '../../types/book';

const CATEGORIES = [
    'Ficção',
    'Não-ficção',
    'Negócios',
    'Tecnologia',
    'Biografias',
    'Autoajuda',
];

const CURATED = [
    { id: 'c1', title: 'Essenciais de programação', query: 'programação' },
    { id: 'c2', title: 'Clássicos da literatura', query: 'clássicos' },
    { id: 'c3', title: 'Alta performance & hábitos', query: 'hábitos' },
];

export default function DiscoveryScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [trending, setTrending] = useState<Book[]>([]);
    const [loadingTrending, setLoadingTrending] = useState(true);

    // Carrega livros "em alta" via service (hoje: top N dos mocks)
    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                const all = await fetchAllBooks();
                if (!isMounted) return;

                // Estratégia mock: primeiros 3 livros como "em alta"
                setTrending(all.slice(0, 3));
            } finally {
                if (isMounted) setLoadingTrending(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    function handleSearch(term?: string) {
        const q = (term ?? search).trim();
        if (!q) return;

        router.push({
            pathname: '/(app)/search',
            params: { q },
        });
    }

    function handleCategoryPress(category: string) {
        handleSearch(category);
    }

    function handleCuratedPress(query: string) {
        handleSearch(query);
    }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 32,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Título + search */}
                <View style={{ marginBottom: 16 }}>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: '800',
                            color: theme.colors.text,
                            marginBottom: 8,
                        }}
                    >
                        Descobrir
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: theme.colors.muted,
                            marginBottom: 12,
                        }}
                    >
                        Busque por títulos, autores, temas ou explore nossas coleções.
                    </Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 999,
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                            backgroundColor: theme.colors.card,
                            borderColor: theme.colors.border,
                            borderWidth: 1,
                        }}
                    >
                        <TouchableOpacity onPress={() => handleSearch()}>
                            <Ionicons
                                name="search-outline"
                                size={18}
                                color={theme.colors.muted}
                                style={{ marginRight: 8 }}
                            />
                        </TouchableOpacity>

                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Buscar livros..."
                            placeholderTextColor={theme.colors.muted}
                            style={{
                                flex: 1,
                                fontSize: 14,
                                color: theme.colors.text,
                            }}
                            returnKeyType="search"
                            onSubmitEditing={() => handleSearch()}
                        />
                    </View>
                </View>

                {/* Curated lists */}
                <View style={{ marginBottom: 20 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '700',
                                color: theme.colors.text,
                            }}
                        >
                            Seleções do Lumina
                        </Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            {CURATED.map((list) => (
                                <TouchableOpacity
                                    key={list.id}
                                    activeOpacity={0.85}
                                    onPress={() => handleCuratedPress(list.query)}
                                    style={{
                                        width: 220,
                                        padding: 16,
                                        borderRadius: 20,
                                        backgroundColor: theme.colors.card,
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
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
                                        {list.title}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: theme.colors.muted,
                                        }}
                                    >
                                        Toque para ver livros relacionados a este tema.
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Categorias grid */}
                <View style={{ marginBottom: 24 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: theme.colors.text,
                            marginBottom: 10,
                        }}
                    >
                        Categorias populares
                    </Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 10,
                        }}
                    >
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                activeOpacity={0.85}
                                onPress={() => handleCategoryPress(cat)}
                                style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 14,
                                    borderRadius: 999,
                                    backgroundColor: theme.colors.card,
                                    borderColor: theme.colors.border,
                                    borderWidth: 1,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: '500',
                                        color: theme.colors.text,
                                    }}
                                >
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Trending */}
                <View>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: theme.colors.text,
                            marginBottom: 10,
                        }}
                    >
                        Em alta esta semana
                    </Text>

                    {loadingTrending ? (
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                    ) : trending.length === 0 ? (
                        <Text style={{ fontSize: 13, color: theme.colors.muted }}>
                            Nenhum livro em alta no momento.
                        </Text>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                {trending.map((book) => (
                                    <BookCoverPreview
                                        key={book.id}
                                        title={book.title}
                                        author={book.author}
                                        compact
                                        onPress={() => router.push(`/book/${book.id}`)}
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
