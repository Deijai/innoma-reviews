// app/(auth)/forgot-password.tsx
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

export default function ForgotPasswordScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSend() {
        if (!email.trim()) return;

        setLoading(true);
        // TODO: na fase Firebase, chamar método real de reset de senha
        await new Promise((r) => setTimeout(r, 800));
        setLoading(false);
        setSent(true);
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
                            Recuperar senha
                        </Text>
                    </View>

                    <Text
                        style={{
                            fontSize: 14,
                            color: theme.colors.muted,
                            marginBottom: 16,
                        }}
                    >
                        Informe o e-mail cadastrado para enviarmos um link de redefinição de
                        senha.
                    </Text>

                    <View style={{ marginBottom: 20 }}>
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

                    <PrimaryButton
                        title={sent ? 'Enviar novamente' : 'Enviar link'}
                        onPress={handleSend}
                        loading={loading}
                        disabled={!email.trim() || loading}
                    />

                    {sent && (
                        <View
                            style={{
                                marginTop: 16,
                                padding: 12,
                                borderRadius: 12,
                                backgroundColor: theme.colors.card,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: theme.colors.text,
                                }}
                            >
                                Se este fosse o ambiente real, você receberia um e-mail com
                                instruções para redefinir sua senha. 📨
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
