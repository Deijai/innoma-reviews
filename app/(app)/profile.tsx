// app/(app)/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../stores/authStore';

const HIGHLIGHTS = [
    {
        id: 'h1',
        type: 'review',
        book: 'Clean Code',
        snippet: 'Um clássico indispensável para qualquer dev...',
    },
    {
        id: 'h2',
        type: 'quote',
        book: 'Deep Work',
        snippet: '"Trabalho profundo é como um superpoder..."',
    },
    {
        id: 'h3',
        type: 'review',
        book: 'Atomic Habits',
        snippet: 'Pequenos ajustes que se acumulam ao longo do tempo.',
    },
];

export default function ProfileScreen() {
    const { theme, toggleTheme, isDark } = useTheme();
    const { user, signOut, isLoading } = useAuthStore();
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
            >
                {/* Header */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 20,
                    }}
                >
                    <View
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 999,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                            backgroundColor: theme.colors.card,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: '700',
                                color: theme.colors.primary,
                            }}
                        >
                            {user?.name?.[0] ?? 'L'}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '700',
                                color: theme.colors.text,
                            }}
                        >
                            {user?.name ?? 'Leitor Lumina'}
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.colors.muted,
                            }}
                        >
                            {user?.email ?? 'demo@lumina.app'}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={toggleTheme}
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
                            name={isDark ? 'sunny-outline' : 'moon-outline'}
                            size={18}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View
                    style={{
                        flexDirection: 'row',
                        padding: 16,
                        borderRadius: 20,
                        marginBottom: 20,
                        backgroundColor: theme.colors.card,
                    }}
                >
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '800',
                                color: theme.colors.text,
                            }}
                        >
                            24
                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.muted,
                            }}
                        >
                            livros lidos
                        </Text>
                    </View>

                    <View
                        style={{
                            width: 1,
                            backgroundColor: theme.colors.border,
                        }}
                    />

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '800',
                                color: theme.colors.text,
                            }}
                        >
                            6
                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.muted,
                            }}
                        >
                            em andamento
                        </Text>
                    </View>

                    <View
                        style={{
                            width: 1,
                            backgroundColor: theme.colors.border,
                        }}
                    />

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '800',
                                color: theme.colors.text,
                            }}
                        >
                            18
                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.muted,
                            }}
                        >
                            avaliações
                        </Text>
                    </View>
                </View>

                {/* Link para configurações */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => router.push('/(app)/settings')}
                    style={{
                        marginBottom: 20,
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
                        <Ionicons
                            name="settings-outline"
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
                                Configurações
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: theme.colors.muted,
                                }}
                            >
                                Notificações, aparência e muito mais.
                            </Text>
                        </View>
                    </View>
                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={theme.colors.muted}
                    />
                </TouchableOpacity>

                {/* Highlights (masonry simples em 2 colunas) */}
                <View style={{ marginBottom: 24 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '700',
                                color: theme.colors.text,
                            }}
                        >
                            Destaques recentes
                        </Text>

                        <TouchableOpacity>
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: '600',
                                    color: theme.colors.primary,
                                }}
                            >
                                Ver todos
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 10,
                        }}
                    >
                        {/* Coluna 1 */}
                        <View style={{ flex: 1, gap: 10 }}>
                            {HIGHLIGHTS.filter((_, idx) => idx % 2 === 0).map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    activeOpacity={0.85}
                                    style={{
                                        padding: 12,
                                        borderRadius: 16,
                                        backgroundColor: theme.colors.card,
                                        borderColor: theme.colors.border,
                                        borderWidth: 1,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            fontWeight: '600',
                                            color: theme.colors.muted,
                                            marginBottom: 4,
                                        }}
                                    >
                                        {item.type === 'review' ? 'Avaliação' : 'Citação'}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            fontWeight: '700',
                                            color: theme.colors.text,
                                            marginBottom: 4,
                                        }}
                                    >
                                        {item.book}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: theme.colors.muted,
                                        }}
                                        numberOfLines={3}
                                    >
                                        {item.snippet}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Coluna 2 */}
                        <View style={{ flex: 1, gap: 10 }}>
                            {HIGHLIGHTS.filter((_, idx) => idx % 2 === 1).map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    activeOpacity={0.85}
                                    style={{
                                        padding: 12,
                                        borderRadius: 16,
                                        backgroundColor: theme.colors.card,
                                        borderColor: theme.colors.border,
                                        borderWidth: 1,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            fontWeight: '600',
                                            color: theme.colors.muted,
                                            marginBottom: 4,
                                        }}
                                    >
                                        {item.type === 'review' ? 'Avaliação' : 'Citação'}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            fontWeight: '700',
                                            color: theme.colors.text,
                                            marginBottom: 4,
                                        }}
                                    >
                                        {item.book}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: theme.colors.muted,
                                        }}
                                        numberOfLines={3}
                                    >
                                        {item.snippet}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Logout (mock) */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => signOut()}
                    style={{
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderRadius: 999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.border,
                        borderWidth: 1,
                        flexDirection: 'row',
                        gap: 8,
                    }}
                >
                    <Ionicons name="log-out-outline" size={18} color={theme.colors.danger} />
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: theme.colors.danger,
                        }}
                    >
                        {isLoading ? 'Saindo...' : 'Sair'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
