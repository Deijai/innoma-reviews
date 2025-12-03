// src/services/authService.ts
import { useAuthStore } from '../stores/authStore';
import type { AuthStateUser } from '../types/user';

/**
 * Login com e-mail/senha (mock).
 * Depois vira Firebase Auth.
 */
export async function signInWithEmail(
    email: string,
    password: string
): Promise<AuthStateUser> {
    const { signIn } = useAuthStore.getState();

    const user = await signIn(email, password);
    return user;
}

/**
 * Criação de conta com e-mail/senha (mock).
 * Hoje não salva em lugar nenhum; futuramente chama Firebase Auth + Firestore.
 */
export async function signUpWithEmail(
    name: string,
    email: string,
    password: string
): Promise<AuthStateUser> {
    const { signIn } = useAuthStore.getState();

    // Fase mock: só loga o user direto
    const user = await signIn(email, password);
    return user;
}

/**
 * Social login Google (mock).
 */
export async function signInWithGoogle(): Promise<AuthStateUser> {
    const { signIn } = useAuthStore.getState();
    const user = await signIn('google.user@example.com', 'social-google');
    return user;
}

/**
 * Social login Apple (mock).
 */
export async function signInWithApple(): Promise<AuthStateUser> {
    const { signIn } = useAuthStore.getState();
    const user = await signIn('apple.user@example.com', 'social-apple');
    return user;
}

/**
 * Logout.
 */
export async function signOut(): Promise<void> {
    const { signOut } = useAuthStore.getState();
    await signOut();
}
