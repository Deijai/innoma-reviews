// components/ui/BookCoverPreview.tsx
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type Props = {
    title: string;
    author: string;
    coverUrl?: string;
    progress?: number; // 0-1 (opcional)
    compact?: boolean;
    onPress?: () => void;
};

export function BookCoverPreview({
    title,
    author,
    coverUrl,
    progress,
    compact,
    onPress
}: Props) {
    const { theme } = useTheme();

    console.log('coverUrl:', coverUrl);


    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={{ width: compact ? 120 : 140 }}
        >
            <View
                style={{
                    height: compact ? 170 : 190,
                    borderRadius: 18,
                    overflow: 'hidden',
                    backgroundColor: theme.colors.card,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                }}
            >
                {/* Imagem de fundo */}
                {coverUrl && (
                    <Image
                        source={{ uri: coverUrl }}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                        }}
                        resizeMode="cover"
                        blurRadius={0}
                    />
                )}

                {/* Overlay para melhorar legibilidade */}
                <View
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: theme.colors.primary
                            ? 'rgba(0, 0, 0, 0.6)'
                            : 'rgba(255, 255, 255, 0.7)',
                    }}
                />

                {/* Conteúdo */}
                <View
                    style={{
                        flex: 1,
                        padding: 10,
                        justifyContent: 'space-between',
                    }}
                >
                    <Text
                        numberOfLines={3}
                        style={{
                            fontWeight: '700',
                            fontSize: 14,
                            color: theme.colors.text,
                        }}
                    >
                        {/* {title} */}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: 12,
                            color: theme.colors.muted,
                            marginTop: 4,
                        }}
                    >
                        {/* {author} */}
                    </Text>

                    {progress !== undefined && (
                        <View
                            style={{
                                marginTop: 10,
                            }}
                        >
                            <View
                                style={{
                                    height: 4,
                                    borderRadius: 999,
                                    backgroundColor: theme.colors.border,
                                }}
                            >
                                <View
                                    style={{
                                        height: 4,
                                        borderRadius: 999,
                                        width: `${Math.round(progress * 100)}%`,
                                        backgroundColor: theme.colors.primary,
                                    }}
                                />
                            </View>
                            <Text
                                style={{
                                    marginTop: 4,
                                    fontSize: 11,
                                    fontWeight: '600',
                                    color: theme.colors.muted,
                                }}
                            >
                                {Math.round(progress * 100)}% lido
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}