// src/views/Home/HomeView.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAllGenres } from '@/controllers/genreAllController';
import Header from './Header';

export interface Genre {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
}

const HomeView = () => {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const loadedGenres = await getAllGenres();
      setGenres(loadedGenres);
    };

    fetchGenres();
  }, []);

  return (
    <div>
      <Header />

      <div style={{ padding: 40 }}>
        <h2 style={{ textAlign: 'center' }}>🎵 Géneros disponibles</h2>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          {genres.length === 0 ? (
            <p>No hay géneros cargados aún.</p>
          ) : (
            genres.map((genre) => (
              <div
                key={genre.id}
                onClick={() => router.push(`/music/${genre.nombre}`)}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  width: 250,
                  padding: 16,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src={genre.imagenUrl}
                  alt={genre.nombre}
                  style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 6 }}
                />
                <h3>{genre.nombre}</h3>
                <p>{genre.descripcion}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeView;
