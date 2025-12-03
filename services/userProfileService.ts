// services/userProfileService.ts
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { useAuthStore } from '../stores/authStore';
import type { AppUser } from '../types/user';
import { auth, db, storage } from './firebaseConfig';


export type UserProfile = AppUser & {
    createdAt?: unknown;
    updatedAt?: unknown;
};

function getCurrentUid(): string | null {
    const current = auth.currentUser;
    return current?.uid ?? null;
}

/**
 * Garante que o documento do usuário exista no Firestore
 * e retorna o perfil.
 */
export async function getOrCreateUserProfile(): Promise<UserProfile | null> {
    const uid = getCurrentUid();
    const current = auth.currentUser;

    if (!uid || !current) return null;

    const refDoc = doc(db, 'users', uid);
    const snap = await getDoc(refDoc);

    if (snap.exists()) {
        return snap.data() as UserProfile;
    }

    const base: UserProfile = {
        id: uid,
        displayName: current.displayName || current.email || 'Leitor',
        email: current.email || '',
        photoURL: current.photoURL ?? null,
    };

    await setDoc(refDoc, {
        ...base,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return base;
}

/**
 * Atualiza dados de perfil (nome, foto, etc) no:
 * - Firebase Auth
 * - Firestore (coleção "users")
 * - Zustand (authStore)
 */
export async function updateUserProfile(
    partial: Partial<AppUser>,
): Promise<UserProfile | null> {
    const uid = getCurrentUid();
    const current = auth.currentUser;

    if (!uid || !current) return null;

    const refDoc = doc(db, 'users', uid);
    const snap = await getDoc(refDoc);
    const existing = (snap.exists() ? snap.data() : {}) as Partial<UserProfile>;

    // Atualiza Firebase Auth
    await updateProfile(current, {
        displayName: partial.displayName ?? current.displayName ?? undefined,
        photoURL: partial.photoURL ?? current.photoURL ?? undefined,
    });

    // Atualiza Firestore
    const merged: UserProfile = {
        id: uid,
        displayName:
            partial.displayName ??
            (existing.displayName as string) ??
            current.displayName ??
            current.email ??
            'Leitor',
        email:
            partial.email ??
            (existing.email as string) ??
            current.email ??
            '',
        photoURL:
            partial.photoURL ??
            (existing.photoURL as string | null | undefined) ??
            current.photoURL ??
            null,
        createdAt: existing.createdAt,
        updatedAt: serverTimestamp(),
    };

    await setDoc(
        refDoc,
        {
            ...merged,
            updatedAt: serverTimestamp(),
        },
        { merge: true },
    );

    // Atualiza store
    const { user, setUser } = useAuthStore.getState();
    if (user) {
        const updatedUser: AppUser = {
            ...user,
            displayName: merged.displayName,
            email: merged.email,
            photoURL: merged.photoURL,
        };
        setUser(updatedUser);
    }

    return merged;
}

/**
 * Faz upload da foto de perfil para o Storage
 * e retorna a URL pública.
 */
export async function uploadProfilePhotoAsync(
    uri: string,
): Promise<string> {
    const uid = getCurrentUid();
    if (!uid) {
        throw new Error('Usuário não autenticado');
    }

    // Converte a URI local em blob
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileRef = ref(storage, `profilePhotos/${uid}.jpg`);
    await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(fileRef);

    // Atualiza perfil com a nova URL
    await updateUserProfile({ photoURL: downloadURL });

    return downloadURL;
}
