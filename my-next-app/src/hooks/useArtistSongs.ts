import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/firebaseinit';

interface Song {
  id: string;
  nombre: string;
  genero: string;
  audioUrl: string;
}

export const useArtistSongs = (artistName?: string) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!artistName) return;

    const fetchArtistSongs = async () => {
      setLoading(true);
      setError('');
      try {

        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        let artistUid: string | null = null;

        usersSnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          const nombreCompleto = `${userData.nombre} ${userData.apellido}`;
          if (nombreCompleto.toLowerCase() === artistName.toLowerCase()) {
            artistUid = userDoc.id;
          }
        });

        if (!artistUid) {
          setError('Artista no encontrado');
          setLoading(false);
          return;
        }

        const songsQuery = query(
          collection(firestore, 'songs'),
          where('uid', '==', artistUid)
        );
        const songsSnapshot = await getDocs(songsQuery);

        const artistSongs: Song[] = songsSnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
          genero: doc.data().genero,
          audioUrl: doc.data().audioUrl,
        }));

        setSongs(artistSongs);
      } catch (err) {
        console.error(err);
        setError('Hubo un error al cargar las canciones.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtistSongs();
  }, [artistName]);

  return { songs, loading, error };
};
