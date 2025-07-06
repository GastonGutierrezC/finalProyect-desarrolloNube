import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/firebaseinit';

export const addGenre = async (
  nombre: string,
  descripcion: string,
  imagenUrl: string
) => {
  try {
    const docRef = await addDoc(collection(firestore, 'genres'), {
      nombre,
      descripcion,
      imagenUrl,
      creadoEn: Timestamp.now(),
    });

    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, message: error.message };
  }


  
};
