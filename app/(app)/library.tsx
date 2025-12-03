// app/(app)/library.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookCoverPreview } from '../../components/ui/BookCoverPreview';
import { EmptyLibraryState } from '../../components/ui/EmptyLibraryState';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { useTheme } from '../../hooks/useTheme';

import { fetchAllBooks } from '../../services/booksService';
import type { Book, BookStatus } from '../../types/book';

const OPTIONS = [
    { label: 'Lendo', value: 'reading' },
    { label: 'Quero ler', value: 'want' },
    { label: 'Lidos', value: 'read' },
];

export default function LibraryScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const [shelf, setShelf] = useState<BookStatus>('reading');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    // Carrega todos os livros via service
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

    const booksOfShelf = useMemo(
        () => books.filter((b) => b.status === shelf),
        [books, shelf],
    );

    const shelfLabel =
        OPTIONS.find((o) => o.value === shelf)?.label ?? 'Minha estante';

    if (loading) {
        return (
            <SafeAreaView
                style={{ flex: 1, backgroundColor: theme.colors.background }}
            >
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 16,
                        paddingTop: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
                {/* Header */}
                <View style={{ marginBottom: 16 }}>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: '800',
                            color: theme.colors.text,
                            marginBottom: 6,
                        }}
                    >
                        Minha biblioteca
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: theme.colors.muted,
                        }}
                    >
                        Organize suas leituras por status.
                    </Text>
                </View>

                {/* Segmented control */}
                <View style={{ marginBottom: 16 }}>
                    <SegmentedControl
                        options={OPTIONS}
                        value={shelf}
                        onChange={(v) => setShelf(v as BookStatus)}
                    />
                </View>

                {/* Conteúdo */}
                {booksOfShelf.length === 0 ? (
                    <EmptyLibraryState shelfLabel={shelfLabel} />
                ) : (
                    <FlatList
                        data={booksOfShelf}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={{
                            justifyContent: 'space-between',
                            marginBottom: 12,
                        }}
                        contentContainerStyle={{ paddingBottom: 24 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={0.85}
                                style={{ marginBottom: 8 }}
                                onPress={() => router.push(`/book/${item.id}`)}
                            >
                                <BookCoverPreview
                                    title={item.title}
                                    author={item.author}
                                    progress={
                                        item.pages > 0
                                            ? item.currentPage / item.pages
                                            : undefined
                                    }
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
