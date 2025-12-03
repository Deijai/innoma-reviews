// app/(auth)/sign-in.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../stores/authStore';

export default function SignInScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { signIn } = useAuthStore();

    // Recebe e-mail vindo da criação de conta (sign-up)
    const { emailPrefill } = useLocalSearchParams<{ emailPrefill?: string }>();

    const [email, setEmail] = useState(emailPrefill || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const canSubmit = !!email.trim() && !!password;

    async function handleSignIn() {
        if (!canSubmit || loading) return;

        try {
            setLoading(true);

            // Agora é login REAL: o signIn do store chama Firebase Auth
            await signIn(email.trim(), password);

            // Redireciona para o app
            router.replace('/(app)/home');
        } catch (error: any) {
            console.log('Erro ao fazer login:', error);
            // Aqui você pode trocar por um toast bonito se quiser
            alert(
                error?.message ??
                'Não foi possível entrar. Verifique seus dados e tente novamente.',
            );
        } finally {
            setLoading(false);
        }
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingTop: 16,
                        paddingBottom: 24,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 24,
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
                            <Ionicons
                                name="chevron-back"
                                size={18}
                                color={theme.colors.text}
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '800',
                                color: theme.colors.text,
                            }}
                        >
                            Entrar
                        </Text>
                    </View>

                    {/* Email */}
                    <View style={{ marginBottom: 12 }}>
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: theme.colors.text,
                                marginBottom: 6,
                            }}
                        >
                            E-mail
                        </Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholder="seu@email.com"
                            placeholderTextColor={theme.colors.muted}
                            style={{
                                borderRadius: 12,
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                backgroundColor: theme.colors.card,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                fontSize: 14,
                                color: theme.colors.text,
                            }}
                        />
                    </View>

                    {/* Password */}
                    <View style={{ marginBottom: 16 }}>
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: theme.colors.text,
                                marginBottom: 6,
                            }}
                        >
                            Senha
                        </Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholder="Digite sua senha"
                            placeholderTextColor={theme.colors.muted}
                            style={{
                                borderRadius: 12,
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                backgroundColor: theme.colors.card,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                fontSize: 14,
                                color: theme.colors.text,
                            }}
                        />
                    </View>

                    <PrimaryButton
                        title="Entrar"
                        onPress={handleSignIn}
                        loading={loading}
                        disabled={!canSubmit || loading}
                    />

                    {/* Divider */}
                    <View
                        style={{
                            marginVertical: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }}
                        />
                        <Text
                            style={{
                                marginHorizontal: 12,
                                color: theme.colors.muted,
                                fontSize: 13,
                            }}
                        >
                            ou continue com
                        </Text>
                        <View
                            style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }}
                        />
                    </View>

                    {/* GOOGLE BUTTON (mock) */}
                    <TouchableOpacity
                        onPress={async () => {
                            // MOCK SOCIAL LOGIN: por enquanto usa o mesmo signIn
                            await signIn(email, password);
                            router.replace('/(app)/home');
                        }}
                        style={{
                            backgroundColor: theme.colors.card,
                            borderRadius: 12,
                            paddingVertical: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 12,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <Ionicons
                            name="logo-google"
                            size={18}
                            color="#4285F4"
                            style={{ marginRight: 8 }}
                        />
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: theme.colors.text,
                            }}
                        >
                            Continuar com Google
                        </Text>
                    </TouchableOpacity>

                    {/* APPLE BUTTON (mock) */}
                    <TouchableOpacity
                        onPress={async () => {
                            // MOCK SOCIAL LOGIN também
                            await signIn(email, password);
                            router.replace('/(app)/home');
                        }}
                        style={{
                            backgroundColor: theme.colors.text,
                            borderRadius: 12,
                            paddingVertical: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 12,
                        }}
                    >
                        <Ionicons
                            name="logo-apple"
                            size={20}
                            color={theme.colors.background}
                            style={{ marginRight: 8 }}
                        />
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: theme.colors.background,
                            }}
                        >
                            Continuar com Apple
                        </Text>
                    </TouchableOpacity>

                    {/* Forgot + Criar conta */}
                    <View
                        style={{
                            marginTop: 16,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/forgot-password')}
                        >
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: '600',
                                    color: theme.colors.primary,
                                }}
                            >
                                Esqueci minha senha
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/sign-up')}
                        >
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: theme.colors.muted,
                                }}
                            >
                                Não tem conta?{' '}
                                <Text
                                    style={{
                                        fontWeight: '600',
                                        color: theme.colors.primary,
                                    }}
                                >
                                    Criar
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
