import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, firestore } from '@/firebaseinit';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

import { uploadSong, getSongsByArtist } from '@/controllers/songController';
import { audioService } from '@/controllers/audioService';

const ArtistPanelView = () => {
  const router = useRouter();
  const [isArtist, setIsArtist] = useState(false);
  const [uid, setUid] = useState('');
  const [formData, setFormData] = useState({ nombre: '', genero: '' });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [songs, setSongs] = useState<any[]>([]);
  const [generos, setGeneros] = useState<any[]>([]);
  const [subiendo, setSubiendo] = useState(false);


  const getGenres = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, 'genres'));
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGeneros(lista);
    } catch (error) {
      console.error("Error al obtener géneros:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      const userData = userDoc.data();

      if (!userData || userData.rol !== 'artist') {
        router.push('/home');
      } else {
        setIsArtist(true);
        setUid(user.uid);
        await getGenres();
        const userSongs = await getSongsByArtist(user.uid);
        setSongs(userSongs);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile) {
      setMensaje('❌ Debes seleccionar un archivo de audio.');
      return;
    }

    setSubiendo(true);
    const audioUrl = await audioService.postAudio(audioFile);
    setSubiendo(false);

    if (!audioUrl) {
      setMensaje('❌ Error al subir el audio.');
      return;
    }

    const result = await uploadSong(uid, formData.nombre, formData.genero, audioUrl);
    if (result.success) {
      setMensaje('✅ Canción subida exitosamente.');
      setFormData({ nombre: '', genero: '' });
      setAudioFile(null);

      const updatedSongs = await getSongsByArtist(uid);
      setSongs(updatedSongs);
    } else {
      setMensaje('❌ ' + result.message);
    }
  };

  if (!isArtist) return null;

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
      <h1>🎤 Artist Panel</h1>

      <h2>Subir nueva canción</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la canción"
          value={formData.nombre}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 8 }}
        />

        <select
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 8 }}
        >
          <option value="">Selecciona un género</option>
          {generos.map((g) => (
            <option key={g.id} value={g.nombre}>
              {g.nombre}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="audio/*"
          onChange={handleAudioChange}
          style={{ width: '100%' }}
        />

        <button
          type="submit"
          disabled={subiendo}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {subiendo ? 'Subiendo audio...' : 'Subir canción'}
        </button>
      </form>

      {mensaje && <p style={{ marginTop: 10 }}>{mensaje}</p>}

      <hr style={{ margin: '40px 0', width: '100%' }} />

      <h2>🎶 Tus canciones subidas</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          width: '100%',
        }}
      >
        {songs.length === 0 ? (
          <p>No has subido canciones todavía.</p>
        ) : (
          songs.map((song) => (
            <div
              key={song.id}
              style={{
                border: '1px solid #ccc',
                padding: 16,
                borderRadius: 8,
              }}
            >
              <h3>{song.nombre}</h3>
              <p>Género: {song.genero}</p>
              <audio controls style={{ width: '100%' }}>
                <source src={song.audioUrl} type="audio/mpeg" />
                Tu navegador no soporta el audio.
              </audio>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArtistPanelView;
