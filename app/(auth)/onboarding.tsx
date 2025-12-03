// app/(auth)/onboarding.tsx
import { Link, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

export default function OnboardingScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
            <View className="flex-1 px-6 justify-between pb-8">
                <View className="mt-6">
                    <Text
                        className="text-xs font-semibold tracking-[3px]"
                        style={{ color: theme.colors.muted }}
                    >
                        BEM-VINDO(A) AO LUMINA
                    </Text>

                    <Text
                        className="mt-3 text-3xl font-extrabold"
                        style={{ color: theme.colors.text }}
                    >
                        Descubra, avalie e compartilhe seus livros favoritos.
                    </Text>

                    <Text
                        className="mt-4 text-base"
                        style={{ color: theme.colors.muted }}
                    >
                        Crie sua biblioteca, acompanhe seu progresso de leitura
                        e conecte-se com outros leitores.
                    </Text>
                </View>

                {/* Ilustração mockada – depois podemos trocar por SVG/Lottie */}
                <View className="items-center">
                    <View
                        className="w-56 h-56 rounded-3xl justify-center items-center"
                        style={{ backgroundColor: theme.colors.card }}
                    >
                        <Text className="text-6xl" style={{ color: theme.colors.primary }}>
                            📚
                        </Text>
                    </View>
                </View>

                <View>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="w-full py-4 rounded-2xl items-center"
                        style={{ backgroundColor: theme.colors.primary }}
                        onPress={() => router.push('/(auth)/sign-in')}
                    >
                        <Text className="text-base font-semibold text-white">
                            Começar
                        </Text>
                    </TouchableOpacity>

                    <View className="mt-4 flex-row justify-center">
                        <Text style={{ color: theme.colors.muted }}>Já tem conta? </Text>
                        <Link
                            href="/(auth)/sign-in"
                            style={{ color: theme.colors.primary, fontWeight: '600' }}
                        >
                            Entrar
                        </Link>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
