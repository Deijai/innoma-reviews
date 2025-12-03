// stores/themeStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

type ThemeState = {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'light',
            setTheme: (theme) => set({ theme }),
            toggleTheme: () => {
                const current = get().theme;
                set({ theme: current === 'light' ? 'dark' : 'light' });
            },
        }),
        {
            name: 'lumina-theme',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
