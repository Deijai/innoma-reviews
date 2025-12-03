// components/ui/PrimaryButton.tsx
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type Props = {
    title: string;
    onPress?: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
};

export function PrimaryButton({ title, onPress, loading, disabled, style }: Props) {
    const { theme } = useTheme();
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            disabled={isDisabled}
            style={[
                {
                    width: '100%',
                    paddingVertical: 14,
                    borderRadius: 999,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.primary,
                    opacity: isDisabled ? 0.7 : 1,
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontWeight: '600',
                        fontSize: 16,
                    }}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}
