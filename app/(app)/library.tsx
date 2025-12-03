// app/(app)/library.tsx
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookCoverPreview } from '../../components/ui/BookCoverPreview';
import { EmptyLibraryState } from '../../components/ui/EmptyLibraryState';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { type BookStatus } from '../../constants/mockData';
import { useTheme } from '../../hooks/useTheme';
import { useBooksStore } from '../../stores/booksStore';

const OPTIONS = [
    { label: 'Lendo', value: 'reading' },
    { label: 'Quero ler', value: 'want' },
    { label: 'Lidos', value: 'read' },
];

export default function LibraryScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const [shelf, setShelf] = useState<BookStatus>('reading');

    const books = useBooksStore((s) => s.books);

    const booksOfShelf = useMemo(
        () => books.filter((b) => b.status === shelf),
        [books, shelf]
    );

    const shelfLabel =
        OPTIONS.find((o) => o.value === shelf)?.label ?? 'Minha estante';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
                                        item.pages > 0 ? item.currentPage / item.pages : undefined
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
