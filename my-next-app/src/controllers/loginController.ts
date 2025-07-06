

import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebaseinit';

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userDoc = await getDoc(doc(firestore, 'users', uid));

    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, message: 'Perfil no encontrado en Firestore' };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
