// hooks/useTheme.ts
import { getTheme } from '../constants/theme';
import { useThemeStore } from '../stores/themeStore';

export function useTheme() {
    const themeMode = useThemeStore((s) => s.theme);
    const toggleTheme = useThemeStore((s) => s.toggleTheme);

    const theme = getTheme(themeMode);
    const isDark = themeMode === 'dark';

    return { themeMode, theme, isDark, toggleTheme };
}
