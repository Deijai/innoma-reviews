// app/(app)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { theme } = useTheme();
    const router = useRouter();

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingTop: 8,
                paddingBottom: 16,
                backgroundColor: theme.colors.card,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
            }}
        >
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];

                // 🔴 Lista de rotas que não devem aparecer na TabBar
                const hiddenRoutes = ['settings', 'search', 'log-reading', 'scan-barcode'];
                if (hiddenRoutes.includes(route.name)) {
                    return null;
                }

                // 🔴 Verificação adicional do href
                // @ts-expect-error: expo-router adiciona href em options
                if (options?.href === null) {
                    return null;
                }

                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                // Central (FAB) – rota "library"
                const isCenter = route.name === 'library';

                if (isCenter) {
                    return (
                        <View
                            key={route.key}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => router.push('/(app)/scan-barcode')}
                                style={{
                                    position: 'absolute',
                                    right: 16,
                                    bottom: 24,
                                    width: 56,
                                    height: 56,
                                    borderRadius: 999,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: theme.colors.primary,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.2,
                                    shadowRadius: 6,
                                    shadowOffset: { width: 0, height: 3 },
                                    elevation: 5,
                                }}
                            >
                                <Ionicons name="barcode-outline" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    );
                }

                const icon = (focused: boolean) => {
                    if (route.name === 'home') return 'home-outline';
                    if (route.name === 'discovery') return 'search-outline';
                    if (route.name === 'profile') return 'person-outline';
                    return 'ellipse-outline';
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        activeOpacity={0.8}
                        onPress={onPress}
                        style={{
                            flex: 1,
                            height: 48,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 24,
                            marginHorizontal: 4,
                            backgroundColor: isFocused ? theme.colors.primarySoft : 'transparent',
                        }}
                    >
                        <Ionicons
                            name={icon(isFocused) as any}
                            size={24}
                            color={isFocused ? theme.colors.primary : theme.colors.muted}
                        />
                        <Text
                            style={{
                                marginLeft: 6,
                                fontSize: 10,
                                fontWeight: '600',
                                color: isFocused ? theme.colors.primary : theme.colors.muted,
                            }}
                        >
                            {String(label).toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default function AppTabsLayout() {
    const { theme } = useTheme();

    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.muted,
            }}
        >
            <Tabs.Screen name="home" options={{ title: 'Início' }} />
            <Tabs.Screen name="discovery" options={{ title: 'Descobrir' }} />
            <Tabs.Screen
                name="library"
                options={{
                    title: 'Biblioteca',
                }}
            />
            <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />

            {/* telas “internas” que não aparecem na TabBar */}
            <Tabs.Screen
                name="settings"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    href: null,
                }}
            />

            <Tabs.Screen
                name="log-reading"
                options={{
                    href: null,
                }}
            />

            <Tabs.Screen
                name="scan-barcode"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
