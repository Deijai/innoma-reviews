// components/ui/SegmentedControl.tsx
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type Option = {
    label: string;
    value: string;
};

type Props = {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
};

export function SegmentedControl({ options, value, onChange }: Props) {
    const { theme } = useTheme();

    return (
        <View
            style={{
                flexDirection: 'row',
                borderRadius: 999,
                padding: 4,
                backgroundColor: theme.colors.card,
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
        >
            {options.map((opt) => {
                const isActive = opt.value === value;
                return (
                    <TouchableOpacity
                        key={opt.value}
                        activeOpacity={0.9}
                        onPress={() => onChange(opt.value)}
                        style={{
                            flex: 1,
                            paddingVertical: 8,
                            borderRadius: 999,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isActive ? theme.colors.primary : 'transparent',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: '600',
                                color: isActive ? '#FFFFFF' : theme.colors.muted,
                            }}
                        >
                            {opt.label.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
