import { firestore } from '@/firebaseinit';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export const uploadSong = async (uid: string, nombre: string, genero: string, audioUrl: string) => {
  try {
    await addDoc(collection(firestore, 'songs'), {
      uid,
      nombre,
      genero,
      audioUrl,
      createdAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Error al subir canción:", error);
    return { success: false, message: 'Error al subir la canción' };
  }
};

export const getSongsByArtist = async (uid: string) => {
  try {
    const q = query(collection(firestore, 'songs'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener canciones:", error);
    return [];
  }
};
