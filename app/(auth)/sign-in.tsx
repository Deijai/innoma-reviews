// app/(auth)/sign-in.tsx
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../stores/authStore';

export default function SignInScreen() {
    const { theme } = useTheme();
    const { signIn, isLoading } = useAuthStore();
    const [email, setEmail] = useState('demo@lumina.app');
    const [password, setPassword] = useState('123456');
    const [showPassword, setShowPassword] = useState(false);

    async function handleSignIn() {
        await signIn(email, password);
    }

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View className="flex-1 px-6 pt-6">
                    <Text
                        className="text-sm font-semibold tracking-[3px]"
                        style={{ color: theme.colors.muted }}
                    >
                        ENTRAR
                    </Text>

                    <Text
                        className="mt-3 text-3xl font-extrabold"
                        style={{ color: theme.colors.text }}
                    >
                        Bem-vindo(a) de volta 👋
                    </Text>

                    <View className="mt-8 gap-y-5">
                        {/* Email */}
                        <View>
                            <Text
                                className="mb-2 text-xs font-medium uppercase"
                                style={{ color: theme.colors.muted }}
                            >
                                Email
                            </Text>
                            <View
                                className="flex-row items-center px-3 py-3 rounded-2xl"
                                style={{
                                    backgroundColor: theme.colors.card,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                }}
                            >
                                <Ionicons
                                    name="mail-outline"
                                    size={18}
                                    color={theme.colors.muted}
                                    style={{ marginRight: 8 }}
                                />
                                <TextInput
                                    className="flex-1 text-base"
                                    placeholder="voce@exemplo.com"
                                    placeholderTextColor={theme.colors.muted}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Senha */}
                        <View>
                            <Text
                                className="mb-2 text-xs font-medium uppercase"
                                style={{ color: theme.colors.muted }}
                            >
                                Senha
                            </Text>
                            <View
                                className="flex-row items-center px-3 py-3 rounded-2xl"
                                style={{
                                    backgroundColor: theme.colors.card,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                }}
                            >
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={18}
                                    color={theme.colors.muted}
                                    style={{ marginRight: 8 }}
                                />
                                <TextInput
                                    className="flex-1 text-base"
                                    placeholder="••••••••"
                                    placeholderTextColor={theme.colors.muted}
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color={theme.colors.muted}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View className="mt-4 items-end">
                        <TouchableOpacity>
                            <Text style={{ color: theme.colors.primary, fontWeight: '500' }}>
                                Esqueci minha senha
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="mt-8">
                        <TouchableOpacity
                            activeOpacity={0.9}
                            disabled={isLoading}
                            className="w-full py-4 rounded-2xl items-center"
                            style={{
                                backgroundColor: theme.colors.primary,
                                opacity: isLoading ? 0.7 : 1,
                            }}
                            onPress={handleSignIn}
                        >
                            <Text className="text-base font-semibold text-white">
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Social (mock) */}
                    <View className="mt-8">
                        <View className="flex-row items-center justify-center mb-4">
                            <View className="h-px flex-1" style={{ backgroundColor: theme.colors.border }} />
                            <Text className="mx-3 text-xs" style={{ color: theme.colors.muted }}>
                                ou continue com
                            </Text>
                            <View className="h-px flex-1" style={{ backgroundColor: theme.colors.border }} />
                        </View>

                        <View className="flex-row justify-center gap-x-4">
                            <TouchableOpacity
                                className="w-12 h-12 rounded-full items-center justify-center"
                                style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }}
                            >
                                <Text style={{ fontSize: 18 }}>G</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="w-12 h-12 rounded-full items-center justify-center"
                                style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }}
                            >
                                <Text style={{ fontSize: 18 }}></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
