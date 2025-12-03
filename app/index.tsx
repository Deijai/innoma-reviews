// app/index.tsx
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../stores/authStore';

export default function Index() {
    const { user, isLoading } = useAuthStore();
    const { theme } = useTheme();

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.background,
                }}
            >
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    // Quando não está mais carregando, decide o redirect
    if (!user) {
        return <Redirect href="/(auth)/onboarding" />;
    }

    return <Redirect href="/(app)/home" />;
}
