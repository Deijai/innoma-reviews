// stores/authStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    signOut as firebaseSignOut,
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { auth } from '../services/firebaseConfig';
import type { AuthStateUser } from '../types/user';

type AuthState = {
    user: AuthStateUser | null;
    isLoading: boolean;

    // agora é login REAL com Firebase
    signIn: (email: string, password: string) => Promise<AuthStateUser>;
    signOut: () => Promise<void>;
    setUser: (user: AuthStateUser | null) => void;
};

function mapFirebaseUser(user: FirebaseUser): AuthStateUser {
    return {
        id: user.uid,
        displayName: user.displayName || user.email || 'Usuário',
        email: user.email || '',
        photoURL: user.photoURL,
    };
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => {
            // Listener global de auth: é chamado sempre que o usuário loga/desloga
            onAuthStateChanged(auth, (firebaseUser) => {
                if (firebaseUser) {
                    const mapped = mapFirebaseUser(firebaseUser);
                    set({ user: mapped, isLoading: false });
                } else {
                    set({ user: null, isLoading: false });
                }
            });

            return {
                user: null,
                isLoading: true,

                async signIn(email, password) {
                    const cred = await signInWithEmailAndPassword(auth, email, password);
                    const mapped = mapFirebaseUser(cred.user);
                    set({ user: mapped });
                    return mapped;
                },

                async signOut() {
                    await firebaseSignOut(auth);
                    set({ user: null });
                },

                setUser(user) {
                    set({ user });
                },
            };
        },
        {
            name: 'lumina-auth',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
