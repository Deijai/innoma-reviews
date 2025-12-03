import { Stack } from 'expo-router';

export default function ReviewLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                presentation: 'modal',
            }}
        >
            <Stack.Screen name="write" />
            <Stack.Screen name="success" />
            <Stack.Screen name="comments" />
        </Stack>
    );
}
