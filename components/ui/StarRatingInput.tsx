// components/ui/StarRatingInput.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type Props = {
    value: number; // 0-5
    onChange: (rating: number) => void;
};

export function StarRatingInput({ value, onChange }: Props) {
    const { theme } = useTheme();

    return (
        <View style={{ flexDirection: 'row', gap: 6 }}>
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= value;
                return (
                    <TouchableOpacity key={star} onPress={() => onChange(star)}>
                        <Ionicons
                            name={filled ? 'star' : 'star-outline'}
                            size={26}
                            color={filled ? '#FACC15' : theme.colors.muted}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
