// app/book/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
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
import { useBooksStore } from '../../stores/booksStore';

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

    const book = useBooksStore((s) =>
        s.books.find((b) => b.id === id),
    );
    const setStatus = useBooksStore((s) => s.updateStatus);

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
                        Talvez esse título ainda não esteja sincronizado na sua
                        biblioteca.
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

    function handleToggleShelf() {
        const next = getNextStatus(book!.status as BookStatus | undefined);
        setStatus(book!.id, next);
    }

    const shelfButtonLabel =
        book.status == null ? 'Adicionar à estante' : 'Alterar estante';

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
                                //blurRadius={12}
                                />
                            </View>
                        )}

                        {/* Frente do "livro" – card original intacto */}
                        {/* <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                borderRadius: 22,
                                padding: 16,
                                justifyContent: 'space-between',
                                backgroundColor: theme.colors.card,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '800',
                                    color: theme.colors.text,
                                }}
                                numberOfLines={4}
                            >
                                {book.title}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: theme.colors.muted,
                                    marginTop: 8,
                                }}
                            >
                                {book.author}
                            </Text>
                            {progress !== undefined && (
                                <View style={{ marginTop: 10 }}>
                                    <View
                                        style={{
                                            height: 5,
                                            borderRadius: 999,
                                            backgroundColor:
                                                theme.colors.border,
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: 5,
                                                borderRadius: 999,
                                                width: `${Math.round(
                                                    progress * 100,
                                                )}%`,
                                                backgroundColor:
                                                    theme.colors.primary,
                                            }}
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            marginTop: 4,
                                            fontSize: 11,
                                            color: theme.colors.muted,
                                        }}
                                    >
                                        {book.currentPage} / {book.pages}{' '}
                                        páginas
                                    </Text>
                                </View>
                            )}
                        </View> */}
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