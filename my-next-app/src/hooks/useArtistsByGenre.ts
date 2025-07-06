import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebaseinit';

interface ArtistInfo {
  uid: string;
  nombreCompleto: string;
  imageURL: string;
}

export const useArtistsByGenre = (genre?: string) => {
  const [artists, setArtists] = useState<ArtistInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!genre) return;

    const fetchArtistsByGenre = async () => {
      setLoading(true);
      setError('');

      try {
        const genreNormalized = genre.trim().toLowerCase();

        const songsSnapshot = await getDocs(collection(firestore, 'songs'));

        const allSongs = songsSnapshot.docs.map(docSnap => {
          return docSnap.data().musicData ?? docSnap.data();
        });


        const filteredSongs = allSongs.filter(songData => {
          const songGenre = (songData.genero || '').toString().toLowerCase();
          return songGenre.includes(genreNormalized);
        });


        const uniqueArtistIds = new Set<string>();
        filteredSongs.forEach(songData => {
          if (songData.uid) uniqueArtistIds.add(songData.uid);
        });

        const artistInfoList: ArtistInfo[] = [];

        for (const uid of uniqueArtistIds) {
          const userDoc = await getDoc(doc(firestore, 'users', uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            artistInfoList.push({
              uid,
              nombreCompleto: `${userData.nombre} ${userData.apellido}`,
              imageURL: userData.imageURL || '/placeholder.jpg',
            });
          }
        }

        setArtists(artistInfoList);
      } catch (err) {
        console.error('❌ Error al obtener artistas por género:', err);
        setError('Error al obtener artistas por género');
      } finally {
        setLoading(false);
      }
    };

    fetchArtistsByGenre();
  }, [genre]);

  return { artists, loading, error };
};
