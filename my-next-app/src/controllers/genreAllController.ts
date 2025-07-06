import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebaseinit';

export const getAllGenres = async (): Promise<Genre[]> => {
  try {
    const snapshot = await getDocs(collection(firestore, 'genres'));

    const genres: Genre[] = snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        imagenUrl: data.imagenUrl || ''
      };
    });

    return genres;
  } catch (error) {
    console.error("Error al obtener géneros:", error);
    return [];
  }
};
