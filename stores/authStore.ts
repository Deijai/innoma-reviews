// stores/authStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthStateUser } from '../types/user';

type AuthState = {
    user: AuthStateUser | null;
    isLoading: boolean;

    // mock de login
    signIn: (email: string, password: string) => Promise<AuthStateUser>;
    signOut: () => Promise<void>;
    setUser: (user: AuthStateUser | null) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,

            async signIn(email, _password) {
                // FASE MOCK: gera um usuário fake
                const user: AuthStateUser = {
                    id: `user-${email}`,
                    displayName: email.split('@')[0] || 'Leitor',
                    email,
                    photoURL: null,
                };

                set({ user });

                return user;
            },

            async signOut() {
                set({ user: null });
            },

            setUser(user) {
                set({ user });
            },
        }),
        {
            name: 'lumina-auth',
            storage: createJSONStorage(() => AsyncStorage),
            // opcional: hooks de hidratação se quiser usar isLoading
        },
    ),
);
