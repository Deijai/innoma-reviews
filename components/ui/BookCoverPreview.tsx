// components/ui/BookCoverPreview.tsx
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type Props = {
    title: string;
    author: string;
    progress?: number; // 0-1 (opcional)
    compact?: boolean;
    onPress?: () => void;
};

export function BookCoverPreview({ title, author, progress, compact, onPress }: Props) {
    const { theme } = useTheme();

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
                    padding: 10,
                    justifyContent: 'space-between',
                    backgroundColor: theme.colors.card,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
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
                    {title}
                </Text>
                <Text
                    numberOfLines={1}
                    style={{
                        fontSize: 12,
                        color: theme.colors.muted,
                        marginTop: 4,
                    }}
                >
                    {author}
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
        </TouchableOpacity>
    );
}
