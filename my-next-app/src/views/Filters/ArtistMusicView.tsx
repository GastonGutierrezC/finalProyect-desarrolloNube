import React from 'react';
import { useRouter } from 'next/router';
import { useArtistSongs } from '@/hooks/useArtistSongs';
import Header from '../Home/Header';


const ArtistMusicView = () => {
  const router = useRouter();
  const { artista } = router.query;

  const { songs, loading, error } = useArtistSongs(typeof artista === 'string' ? artista : undefined);

  return (
    <div 
    
    
    style={{ padding: 40, maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <h1>Canciones de: {artista}</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : songs.length === 0 ? (
        <p>Este artista no tiene canciones aún.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
          {songs.map((song) => (
            <div key={song.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
              <h3>{song.nombre}</h3>
              <p>Género: {song.genero}</p>
              <audio controls style={{ width: '100%' }}>
                <source src={song.audioUrl} type="audio/mpeg" />
                Tu navegador no soporta el audio.
              </audio>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistMusicView;
