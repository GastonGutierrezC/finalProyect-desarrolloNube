
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebaseinit';
import { RegisterData } from '@/models/user';



export const registerUser = async (data: RegisterData) => {
  const { nombre, apellido, email, password, fechaNacimiento,rol,imageURL } = data;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(firestore, 'users', uid), {
      nombre,
      apellido,
      email,
      fechaNacimiento, 
     createdAt: new Date().toISOString(),
      rol,
      imageURL,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error en el registro:', error);
    return { success: false, message: error.message };
  }
};
