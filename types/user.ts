// src/types/user.ts

// Usuário “aplicação”, já pensando em Firebase Auth
export interface AppUser {
    id: string; // em Firebase depois vira uid
    displayName: string;
    email: string;
    photoURL?: string | null;
}

// Se quiser separar o user logado:
export interface AuthStateUser extends AppUser {
    // futuro: providerId, isAnonymous etc.
}
