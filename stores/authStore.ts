// stores/authStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type User = {
    id: string;
    name: string;
    email: string;
};

type AuthState = {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            signIn: async (email, _password) => {
                set({ isLoading: true });
                // 🔹 MOCK: aqui futuramente entra Firebase/OIDC/etc
                await new Promise((r) => setTimeout(r, 800));

                set({
                    user: {
                        id: 'mock-user-1',
                        name: 'Leitor Lumina',
                        email,
                    },
                    isLoading: false,
                });
            },
            signOut: async () => {
                set({ isLoading: true });
                await new Promise((r) => setTimeout(r, 300));
                set({ user: null, isLoading: false });
            },
        }),
        {
            name: 'lumina-auth',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
