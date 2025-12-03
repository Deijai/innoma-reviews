// app/(app)/log-reading.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import type { BookStatus } from '../../constants/mockData';
import { useTheme } from '../../hooks/useTheme';
import { useBooksStore } from '../../stores/booksStore';

export default function LogReadingScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const books = useBooksStore((s) => s.books);
    const updateProgress = useBooksStore((s) => s.updateProgress);
    const setStatus = useBooksStore((s) => s.updateStatus);

    const readingBooks = useMemo(
        () => books.filter((b) => b.status === 'reading'),
        [books]
    );

    const candidates = useMemo(() => {
        if (readingBooks.length > 0) return readingBooks;
        return books;
    }, [readingBooks, books]);

    const [selectedId, setSelectedId] = useState<string | null>(
        candidates[0]?.id ?? null
    );
    const selectedBook = useMemo(
        () => books.find((b) => b.id === selectedId),
        [books, selectedId]
    );

    const [pageInput, setPageInput] = useState(
        selectedBook?.currentPage?.toString() ?? ''
    );
    const [saving, setSaving] = useState(false);

    function handleClose() {
        router.back();
    }

    function handleSelectBook(id: string) {
        setSelectedId(id);
        const b = books.find((bk) => bk.id === id);
        if (b) setPageInput(b.currentPage?.toString() ?? '');
    }

    async function handleSave() {
        if (!selectedBook) return;
        const pageNumber = parseInt(pageInput || '0', 10);
        if (Number.isNaN(pageNumber) || pageNumber < 0) return;

        setSaving(true);

        // Atualiza progresso
        updateProgress(selectedBook.id, pageNumber);

        // Garante que está como "reading"
        if (selectedBook.status !== 'reading') {
            setStatus(selectedBook.id, 'reading' as BookStatus);
        }

        setSaving(false);
        router.back();
    }

    const canSave =
        !!selectedBook &&
        !!pageInput &&
        !Number.isNaN(parseInt(pageInput, 10)) &&
        parseInt(pageInput, 10) >= 0;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingTop: Platform.OS === 'android' ? 8 : 0,
                    paddingBottom: 8,
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
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: theme.colors.text,
                        }}
                    >
                        Registrar leitura
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: theme.colors.muted,
                        }}
                    >
                        Atualize seu progresso em um dos seus livros.
                    </Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 24,
                    paddingTop: 8,
                }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Se não tiver nenhum livro no store */}
                {books.length === 0 ? (
                    <View
                        style={{
                            marginTop: 40,
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
                            Nenhum livro na sua biblioteca
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: theme.colors.muted,
                                textAlign: 'center',
                            }}
                        >
                            Adicione livros à sua biblioteca primeiro para poder registrar a
                            leitura.
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Seletor de livro */}
                        <View style={{ marginBottom: 20 }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: '600',
                                    color: theme.colors.text,
                                    marginBottom: 6,
                                }}
                            >
                                Escolha o livro
                            </Text>

                            <View
                                style={{
                                    borderRadius: 16,
                                    backgroundColor: theme.colors.card,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                }}
                            >
                                {candidates.map((book, index) => {
                                    const isSelected = book.id === selectedId;
                                    return (
                                        <TouchableOpacity
                                            key={book.id}
                                            activeOpacity={0.85}
                                            onPress={() => handleSelectBook(book.id)}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                paddingHorizontal: 12,
                                                paddingVertical: 10,
                                                backgroundColor: isSelected
                                                    ? theme.colors.primary
                                                    : 'transparent',
                                                borderTopWidth: index === 0 ? 0 : 1,
                                                borderTopColor: theme.colors.border,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 999,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 10,
                                                    backgroundColor: theme.colors.background,
                                                }}
                                            >
                                                <Ionicons
                                                    name={
                                                        isSelected
                                                            ? 'book'
                                                            : 'book-outline'
                                                    }
                                                    size={18}
                                                    color={
                                                        isSelected
                                                            ? theme.colors.primary
                                                            : theme.colors.muted
                                                    }
                                                />
                                            </View>

                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: '600',
                                                        color: theme.colors.text,
                                                    }}
                                                    numberOfLines={1}
                                                >
                                                    {book.title}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        color: theme.colors.muted,
                                                    }}
                                                    numberOfLines={1}
                                                >
                                                    {book.author}
                                                </Text>
                                            </View>

                                            {book.pages > 0 && (
                                                <Text
                                                    style={{
                                                        fontSize: 11,
                                                        color: theme.colors.muted,
                                                        marginLeft: 6,
                                                    }}
                                                >
                                                    {book.currentPage}/{book.pages}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Página atual */}
                        {selectedBook && (
                            <View style={{ marginBottom: 24 }}>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: '600',
                                        color: theme.colors.text,
                                        marginBottom: 6,
                                    }}
                                >
                                    Página atual
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: theme.colors.muted,
                                        marginBottom: 6,
                                    }}
                                >
                                    Informe em que página você está neste momento.
                                </Text>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderRadius: 12,
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        backgroundColor: theme.colors.card,
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
                                    }}
                                >
                                    <Ionicons
                                        name="create-outline"
                                        size={18}
                                        color={theme.colors.muted}
                                        style={{ marginRight: 8 }}
                                    />
                                    <TextInput
                                        value={pageInput}
                                        onChangeText={setPageInput}
                                        keyboardType="number-pad"
                                        placeholder="Ex.: 42"
                                        placeholderTextColor={theme.colors.muted}
                                        style={{
                                            flex: 1,
                                            fontSize: 14,
                                            color: theme.colors.text,
                                        }}
                                    />
                                    {selectedBook.pages > 0 && (
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: theme.colors.muted,
                                                marginLeft: 8,
                                            }}
                                        >
                                            / {selectedBook.pages}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Botão salvar */}
                        <PrimaryButton
                            title="Salvar progresso"
                            onPress={handleSave}
                            loading={saving}
                            disabled={!canSave || saving}
                        />
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
