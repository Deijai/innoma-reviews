// constants/theme.ts
import type { ThemeMode } from '../stores/themeStore';

export type AppTheme = {
    mode: ThemeMode;
    colors: {
        background: string;
        card: string;
        text: string;
        muted: string;
        border: string;
        primary: string;
        primarySoft: string;
        danger: string;
    };
};

const base = {
    primary: '#5D5FEF',
    primarySoft: '#EEF0FF',
    danger: '#EF4444',
};

export const lightTheme: AppTheme = {
    mode: 'light',
    colors: {
        background: '#F5F5FA',
        card: '#FFFFFF',
        text: '#111827',
        muted: '#6B7280',
        border: '#E5E7EB',
        ...base,
    },
};

export const darkTheme: AppTheme = {
    mode: 'dark',
    colors: {
        background: '#020617',
        card: '#0B1120',
        text: '#F9FAFB',
        muted: '#9CA3AF',
        border: '#1F2937',
        ...base,
    },
};

export function getTheme(mode: ThemeMode): AppTheme {
    return mode === 'dark' ? darkTheme : lightTheme;
}
