// services/firebaseConfig.ts
// services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 👇 IMPORTES ESPECÍFICOS PARA REACT NATIVE
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    // @ts-ignore
    getReactNativePersistence,
    initializeAuth
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB_6FmjziPvKcHYzK63GgTbx3oTsuqKr3I",
    authDomain: "innoma-reviews.firebaseapp.com",
    projectId: "innoma-reviews",
    storageBucket: "innoma-reviews.firebasestorage.app",
    messagingSenderId: "13786374736",
    appId: "1:13786374736:web:322df5c64596a14fc8e755",
    measurementId: "G-5HL526P6D1"
};

// Inicializa o app uma única vez
const app = initializeApp(firebaseConfig);

// 🔐 Auth com persistência em AsyncStorage (mantém logado)
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore + Storage
export const db = getFirestore(app);
export const storage = getStorage(app);
