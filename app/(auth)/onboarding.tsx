// app/(auth)/onboarding.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Text,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

export default function OnboardingScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    // animação de "flutuar"
    const float = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(float, {
                    toValue: 1,
                    duration: 2500,
                    useNativeDriver: true,
                }),
                Animated.timing(float, {
                    toValue: 0,
                    duration: 2500,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, [float]);

    const floatingStyle = {
        transform: [
            {
                translateY: float.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10], // sobe um pouco
                }),
            },
        ],
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
                paddingHorizontal: 24,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {/* “Ilustração” fake só pra ter algo visual e animado */}
            <Animated.View
                style={[
                    {
                        width: 220,
                        height: 220,
                        borderRadius: 999,
                        backgroundColor: theme.colors.primarySoft,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 40,
                    },
                    floatingStyle,
                ]}
            >
                <Text
                    style={{
                        fontSize: 48,
                        color: theme.colors.primary,
                    }}
                >
                    📚
                </Text>
            </Animated.View>

            {/* Título */}
            <Text
                style={{
                    fontSize: 28,
                    fontWeight: '800',
                    color: theme.colors.text,
                    textAlign: 'center',
                    marginBottom: 12,
                }}
            >
                Bem-vindo ao Lumina
            </Text>

            {/* Subtítulo */}
            <Text
                style={{
                    fontSize: 15,
                    color: theme.colors.muted,
                    textAlign: 'center',
                    lineHeight: 22,
                    marginBottom: 28,
                }}
            >
                Descubra novos livros, acompanhe sua leitura, escreva reviews
                e conecte-se com outros leitores apaixonados.
            </Text>

            {/* Botão principal */}
            <TouchableOpacity
                onPress={() => router.push('/(auth)/sign-in')}
                style={{
                    width: '100%',
                    backgroundColor: theme.colors.primary,
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: '#FFFFFF',
                    }}
                >
                    Começar
                </Text>
            </TouchableOpacity>

            {/* Link para login */}
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.colors.primary,
                    }}
                >
                    Já tenho uma conta
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
