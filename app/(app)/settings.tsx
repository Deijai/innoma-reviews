// app/(app)/settings.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../stores/authStore';

export default function SettingsScreen() {
    const { theme, isDark, toggleTheme } = useTheme();
    const router = useRouter();
    const { signOut, isLoading } = useAuthStore();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {/* Header */}
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
                    <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: theme.colors.text,
                    }}
                >
                    Configurações
                </Text>
            </View>

            <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                {/* Aparência */}
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: theme.colors.muted,
                        marginBottom: 8,
                    }}
                >
                    APARÊNCIA
                </Text>

                <View
                    style={{
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                        borderRadius: 16,
                        backgroundColor: theme.colors.card,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 20,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Ionicons
                            name={isDark ? 'moon-outline' : 'sunny-outline'}
                            size={20}
                            color={theme.colors.text}
                        />
                        <View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: theme.colors.text,
                                }}
                            >
                                Tema escuro
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: theme.colors.muted,
                                }}
                            >
                                Altere entre tema claro e escuro.
                            </Text>
                        </View>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        thumbColor="#FFFFFF"
                        trackColor={{
                            true: theme.colors.primary,
                            false: theme.colors.border,
                        }}
                    />
                </View>

                {/* Conta */}
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: theme.colors.muted,
                        marginBottom: 8,
                    }}
                >
                    CONTA
                </Text>

                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => signOut()}
                    style={{
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                        borderRadius: 16,
                        backgroundColor: theme.colors.card,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: theme.colors.danger,
                            }}
                        >
                            {isLoading ? 'Saindo...' : 'Sair da conta'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
