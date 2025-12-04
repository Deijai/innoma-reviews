// app/(app)/discovery.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks/useTheme';
import { addBookToShelf, fetchDiscoveryBooks } from '../../services/booksService';
import type { Book } from '../../types/book';

export default function DiscoveryScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const [trending, setTrending] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [addingBook, setAddingBook] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            try {
                setLoading(true);
                // ✅ CORRETO: Busca livros da API para descoberta
                const discoveryBooks = await fetchDiscoveryBooks();
                if (!isMounted) return;

                setTrending(discoveryBooks.slice(0, 10));
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

    async function handleAddBook(book: Book) {
        try {
            setAddingBook(book.id);
            await addBookToShelf(book, 'want');
            Alert.alert('Sucesso!', `"${book.title}" foi adicionado à sua estante.`);
        } catch (error) {
            console.log('Erro ao adicionar livro:', error);
            Alert.alert('Erro', 'Não foi possível adicionar o livro. Tente novamente.');
        } finally {
            setAddingBook(null);
        }
    }

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
                                <View
                                    key={book.id}
                                    style={{
                                        width: 140,
                                        borderRadius: 16,
                                        backgroundColor: theme.colors.card,
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
                                        padding: 10,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push(`/book/${book.id}`)
                                        }
                                        activeOpacity={0.9}
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
                                                marginBottom: 8,
                                            }}
                                            numberOfLines={1}
                                        >
                                            {book.author}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Botão para adicionar à estante */}
                                    <TouchableOpacity
                                        onPress={() => handleAddBook(book)}
                                        disabled={addingBook === book.id}
                                        style={{
                                            paddingVertical: 6,
                                            borderRadius: 8,
                                            alignItems: 'center',
                                            backgroundColor: addingBook === book.id
                                                ? theme.colors.border
                                                : theme.colors.primary,
                                        }}
                                    >
                                        {addingBook === book.id ? (
                                            <ActivityIndicator size="small" color="#FFFFFF" />
                                        ) : (
                                            <Text
                                                style={{
                                                    fontSize: 11,
                                                    fontWeight: '600',
                                                    color: '#FFFFFF',
                                                }}
                                            >
                                                Adicionar
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}