// components/ui/EmptyLibraryState.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { PrimaryButton } from './PrimaryButton';

type Props = {
    shelfLabel: string;
};

export function EmptyLibraryState({ shelfLabel }: Props) {
    const { theme } = useTheme();
    const router = useRouter();

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 32,
            }}
        >
            <View
                style={{
                    width: 160,
                    height: 160,
                    borderRadius: 999,
                    marginBottom: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.card,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                }}
            >
                <Text style={{ fontSize: 48 }}>📙</Text>
            </View>

            <Text
                style={{
                    fontSize: 18,
                    fontWeight: '700',
                    textAlign: 'center',
                    color: theme.colors.text,
                    marginBottom: 8,
                }}
            >
                Nenhum livro em “{shelfLabel}”
            </Text>

            <Text
                style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: theme.colors.muted,
                    marginBottom: 24,
                }}
            >
                Que tal explorar novos títulos e começar sua próxima leitura?
            </Text>

            <PrimaryButton
                title="Explorar catálogo"
                onPress={() => router.push('/(app)/discovery')}
                style={{ width: 220 }}
            />
        </View>
    );
}
