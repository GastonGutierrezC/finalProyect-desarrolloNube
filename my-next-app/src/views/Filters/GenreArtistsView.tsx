import React from 'react';
import { useRouter } from 'next/router';
import { useArtistsByGenre } from '@/hooks/useArtistsByGenre';
import Header from '../Home/Header';


const GenreArtistsView = () => {
  const router = useRouter();
  const { genero } = router.query;

  const { artists, loading, error } = useArtistsByGenre(typeof genero === 'string' ? genero : undefined);

  return (
    <div
      style={{
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 600,
        margin: '0 auto',
      }}
    >
          
      <h1>🎧 Artistas del género: {genero}</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : artists.length === 0 ? (
        <p>No hay artistas con canciones de este género aún.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          {artists.map((artist) => (
            <button
              key={artist.uid}
              onClick={() => router.push(`/artistMusic/${artist.nombreCompleto}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: 10,
                border: '1px solid #ccc',
                borderRadius: 8,
                background: '#1a1a1a',
                color: '#eee',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <img
                src={artist.imageURL}
                alt={artist.nombreCompleto}
                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }}
              />
              <span>{artist.nombreCompleto}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreArtistsView;
