// app/book/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import type { BookStatus } from '../../constants/mockData';
import { useTheme } from '../../hooks/useTheme';
import {
    addBookToShelf,
    fetchBookById,
    updateBookStatus
} from '../../services/booksService';
import type { Book } from '../../types/book';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STATUS_LABEL: Record<BookStatus, string> = {
    reading: 'Lendo agora',
    want: 'Quero ler',
    read: 'Lido',
};

function getNextStatus(current?: BookStatus): BookStatus {
    if (!current) return 'want';
    if (current === 'want') return 'reading';
    if (current === 'reading') return 'read';
    return 'want';
}

export default function BookDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { theme } = useTheme();
    const router = useRouter();

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Busca o livro (no store ou na API)
    useEffect(() => {
        let isMounted = true;

        async function load() {
            if (!id) return;

            try {
                setLoading(true);
                const foundBook = await fetchBookById(id);
                if (isMounted) {
                    setBook(foundBook || null);
                }
            } catch (error) {
                console.log('Erro ao buscar livro:', error);
                if (isMounted) {
                    setBook(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            isMounted = false;
        };
    }, [id]);

    async function handleToggleShelf() {
        if (!book || updatingStatus) return;

        const currentStatus = book.status as BookStatus | undefined;
        const next = getNextStatus(currentStatus);

        try {
            setUpdatingStatus(true);

            // Se o livro não está na estante ainda (status null/undefined)
            if (!currentStatus) {
                await addBookToShelf(book, next);
            } else {
                // Atualiza o status no Firestore
                await updateBookStatus(book.id, next);
            }

            // Atualiza o estado local para feedback imediato
            setBook({ ...book, status: next });

            // Feedback visual
            Alert.alert(
                'Estante atualizada!',
                `"${book.title}" agora está em: ${STATUS_LABEL[next]}`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.log('Erro ao atualizar estante:', error);
            Alert.alert(
                'Erro',
                'Não foi possível atualizar a estante. Tente novamente.',
                [{ text: 'OK' }]
            );
        } finally {
            setUpdatingStatus(false);
        }
    }

    if (loading) {
        return (
            <SafeAreaView
                style={{ flex: 1, backgroundColor: theme.colors.background }}
            >
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text
                        style={{
                            marginTop: 12,
                            fontSize: 14,
                            color: theme.colors.muted,
                        }}
                    >
                        Carregando livro...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!book) {
        return (
            <SafeAreaView
                style={{ flex: 1, backgroundColor: theme.colors.background }}
            >
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 24,
                    }}
                >
                    <Ionicons
                        name="alert-circle-outline"
                        size={64}
                        color={theme.colors.muted}
                        style={{ marginBottom: 16 }}
                    />
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '700',
                            color: theme.colors.text,
                            marginBottom: 8,
                        }}
                    >
                        Livro não encontrado
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: theme.colors.muted,
                            textAlign: 'center',
                            marginBottom: 16,
                        }}
                    >
                        Não foi possível encontrar este livro. Tente buscar novamente.
                    </Text>
                    <PrimaryButton
                        title="Voltar"
                        onPress={() => router.back()}
                        style={{ width: 160 }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    const progress =
        book.pages > 0 ? Math.min(book.currentPage / book.pages, 1) : undefined;

    const shelfLabel = STATUS_LABEL[book.status as BookStatus];

    const shelfButtonLabel = !book.status
        ? 'Adicionar à estante'
        : updatingStatus
            ? 'Atualizando...'
            : 'Alterar estante';

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            {/* Header simples */}
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
                        width: 36,
                        height: 36,
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
                        size={20}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>
                <Text
                    numberOfLines={1}
                    style={{
                        flex: 1,
                        fontSize: 16,
                        fontWeight: '700',
                        color: theme.colors.text,
                    }}
                >
                    {book.title}
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 32,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* "Capa" estilizada com sombra e imagem de fundo desfocada */}
                <ImageBackground
                    source={{ uri: book.coverUrl }}
                    style={{
                        width: SCREEN_WIDTH,
                        marginTop: 16,
                        marginBottom: 20,
                        alignItems: 'center',
                        overflow: 'hidden',
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        paddingBottom: 24,
                    }}
                    blurRadius={20}
                    resizeMode="cover"
                >
                    {/* Overlay para melhorar contraste */}
                    <View
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: theme.colors.primary
                                ? 'rgba(0, 0, 0, 0.5)'
                                : 'rgba(255, 255, 255, 0.5)',
                        }}
                    />

                    <View
                        style={{
                            width: 200,
                            height: 260,
                            marginVertical: 32,
                        }}
                    >
                        {/* Fundo / sombra da capa */}
                        {book.coverUrl && (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 12,
                                    left: 12,
                                    right: -12,
                                    bottom: -12,
                                    borderRadius: 22,
                                    overflow: 'hidden',
                                    opacity: 0.35,
                                    backgroundColor: theme.colors.card,
                                }}
                            >
                                <Image
                                    source={{ uri: book.coverUrl }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    resizeMode="cover"
                                />
                            </View>
                        )}
                    </View>
                </ImageBackground>

                {/* Restante do conteúdo com padding */}
                <View style={{ paddingHorizontal: 16 }}>
                    {/* Infos principais */}
                    <View style={{ marginBottom: 20 }}>
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: '800',
                                color: theme.colors.text,
                                marginBottom: 4,
                            }}
                        >
                            {book.title}
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: theme.colors.muted,
                                marginBottom: 8,
                            }}
                        >
                            {book.author}
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 16,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Ionicons
                                    name="star"
                                    size={16}
                                    color="#FACC15"
                                />
                                <Text
                                    style={{
                                        marginLeft: 4,
                                        fontSize: 13,
                                        fontWeight: '600',
                                        color: theme.colors.text,
                                    }}
                                >
                                    {book.rating.toFixed(1)}
                                </Text>
                            </View>

                            <Text
                                style={{
                                    fontSize: 13,
                                    color: theme.colors.muted,
                                }}
                            >
                                {book.pages} páginas
                            </Text>
                        </View>

                        {/* Status atual na estante */}
                        {shelfLabel && (
                            <Text
                                style={{
                                    marginTop: 8,
                                    fontSize: 13,
                                    color: theme.colors.muted,
                                }}
                            >
                                Status na estante:{' '}
                                <Text
                                    style={{
                                        fontWeight: '600',
                                        color: theme.colors.text,
                                    }}
                                >
                                    {shelfLabel}
                                </Text>
                            </Text>
                        )}
                    </View>

                    {/* Ações */}
                    <View style={{ marginBottom: 20, gap: 10 }}>
                        <PrimaryButton
                            title={shelfButtonLabel}
                            onPress={handleToggleShelf}
                            disabled={updatingStatus}
                            loading={updatingStatus}
                        />

                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    flex: 1,
                                    paddingVertical: 12,
                                    borderRadius: 999,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: theme.colors.card,
                                    borderColor: theme.colors.border,
                                    borderWidth: 1,
                                }}
                                onPress={() =>
                                    router.push({
                                        pathname: '/review/write',
                                        params: { id: book.id },
                                    })
                                }
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: '600',
                                        color: theme.colors.text,
                                    }}
                                >
                                    Avaliar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    flex: 1,
                                    paddingVertical: 12,
                                    borderRadius: 999,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: theme.colors.card,
                                    borderColor: theme.colors.border,
                                    borderWidth: 1,
                                }}
                                onPress={() =>
                                    router.push({
                                        pathname: '/review/write',
                                        params: { id: book.id },
                                    })
                                }
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: '600',
                                        color: theme.colors.text,
                                    }}
                                >
                                    Escrever review
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={{
                                marginTop: 8,
                                paddingVertical: 10,
                                borderRadius: 999,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: theme.colors.card,
                                borderColor: theme.colors.border,
                                borderWidth: 1,
                                flexDirection: 'row',
                                gap: 6,
                            }}
                            onPress={() =>
                                router.push({
                                    pathname: '/review/comments',
                                    params: { id: book.id },
                                })
                            }
                        >
                            <Ionicons
                                name="chatbubble-ellipses-outline"
                                size={16}
                                color={theme.colors.text}
                            />
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: '600',
                                    color: theme.colors.text,
                                }}
                            >
                                Ver comentários
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Descrição */}
                    <View style={{ marginBottom: 20 }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '700',
                                color: theme.colors.text,
                                marginBottom: 6,
                            }}
                        >
                            Sobre o livro
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: theme.colors.muted,
                                lineHeight: 20,
                            }}
                        >
                            {book.description}
                        </Text>
                    </View>

                    {/* Tags */}
                    {book.tags?.length ? (
                        <View>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '700',
                                    color: theme.colors.text,
                                    marginBottom: 6,
                                }}
                            >
                                Temas principais
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    gap: 8,
                                }}
                            >
                                {book.tags.map((tag) => (
                                    <View
                                        key={tag}
                                        style={{
                                            paddingHorizontal: 10,
                                            paddingVertical: 6,
                                            borderRadius: 999,
                                            backgroundColor: theme.colors.card,
                                            borderWidth: 1,
                                            borderColor: theme.colors.border,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: theme.colors.muted,
                                            }}
                                        >
                                            {tag}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : null}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}