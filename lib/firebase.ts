import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDY0auYecn8RNAarzMeBf0qu2GgfRDzyr0",
  authDomain: "nanda-tent.firebaseapp.com",
  projectId: "nanda-tent",
  storageBucket: "nanda-tent.firebasestorage.app",
  messagingSenderId: "973471111652",
  appId: "1:973471111652:web:7eba8a7cd82e33e6028ff1",
  measurementId: "G-C2B6M5T0SK"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;