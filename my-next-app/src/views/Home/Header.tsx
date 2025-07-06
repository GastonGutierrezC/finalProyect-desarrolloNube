// src/components/Header.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, firestore } from '@/firebaseinit';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Header = () => {
  const router = useRouter();
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [rol, setRol] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      const data = userDoc.data();

      if (data) {
        setNombreCompleto(`${data.nombre} ${data.apellido}`);
        setRol(data.rol);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const goToAdmin = () => {
    router.push('/adminPanel');
  };

  const goToArtist = () => {
    router.push('/artistPanel');
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#1c1c1c',
      color: '#fff',
      padding: '10px 20px',
      borderBottom: '2px solid #5b2a86'
    }}>
      
      <h2>🎧 Bienvenido, {nombreCompleto}</h2>

      <div style={{ display: 'flex', gap: 12 }}>
        {rol === 'admin' && (
          <button onClick={goToAdmin}>Admin Panel</button>
        )}
        {rol === 'artist' && (
          <button onClick={goToArtist}>Artist Panel</button>
        )}
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </header>
  );
};

export default Header;
