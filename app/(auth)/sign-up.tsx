// app/(auth)/sign-up.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function SignUpScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const canSubmit =
        !!name.trim() &&
        !!email.trim() &&
        !!password &&
        password === confirm;

    async function handleSignUp() {
        if (!canSubmit) return;

        setLoading(true);

        // 👉 FASE MOCK:
        // Aqui, na fase Firebase, vamos de fato criar o usuário.
        // Por enquanto, só voltamos para o login com o e-mail preenchido.
        setLoading(false);

        router.replace({
            pathname: '/(auth)/sign-in',
            params: { emailPrefill: email },
        });
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
                            Criar conta
                        </Text>
                    </View>

                    {/* Campos */}
                    <View style={{ marginBottom: 12 }}>
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: theme.colors.text,
                                marginBottom: 6,
                            }}
                        >
                            Nome
                        </Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Como gostaria de ser chamado(a)?"
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
                            keyboardType="email-address"
                            autoCapitalize="none"
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

                    <View style={{ marginBottom: 12 }}>
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
                            placeholder="Crie uma senha"
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

                    <View style={{ marginBottom: 20 }}>
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: theme.colors.text,
                                marginBottom: 6,
                            }}
                        >
                            Confirmar senha
                        </Text>
                        <TextInput
                            value={confirm}
                            onChangeText={setConfirm}
                            secureTextEntry
                            placeholder="Digite novamente a senha"
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
                        {password && confirm && password !== confirm && (
                            <Text
                                style={{
                                    marginTop: 4,
                                    fontSize: 12,
                                    color: '#DC2626',
                                }}
                            >
                                As senhas não coincidem.
                            </Text>
                        )}
                    </View>

                    <PrimaryButton
                        title="Criar conta"
                        onPress={handleSignUp}
                        loading={loading}
                        disabled={!canSubmit || loading}
                    />

                    <View
                        style={{
                            marginTop: 16,
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.colors.muted,
                            }}
                        >
                            Já tem uma conta?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: '600',
                                    color: theme.colors.primary,
                                }}
                            >
                                Fazer login
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
