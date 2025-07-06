import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, firestore } from '@/firebaseinit';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { addGenre } from '@/controllers/genreController';
import { imageService } from '@/controllers/Image-service';

interface FormData {
  nombre: string;
  descripcion: string;
}

export const useAdminPanel = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    descripcion: '',
  });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      const userData = userDoc.data();

      if (!userData || userData.rol !== 'admin') {
        router.push('/home');
      } else {
        setIsAdmin(true);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagenFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagenFile) {
      setMensaje('❌ Debes seleccionar una imagen.');
      return;
    }

    setSubiendo(true);
    const imagenUrl = await imageService.postImage(imagenFile);
    setSubiendo(false);

    if (!imagenUrl) {
      setMensaje('❌ Error al subir la imagen.');
      return;
    }

    const response = await addGenre(
      formData.nombre,
      formData.descripcion,
      imagenUrl
    );

    if (response.success) {
      setMensaje('✅ Género agregado correctamente.');
      setFormData({ nombre: '', descripcion: '' });
      setImagenFile(null);
    } else {
      setMensaje(`❌ Error: ${response.message}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return {
    isAdmin,
    formData,
    mensaje,
    subiendo,
    handleChange,
    handleImageChange,
    handleSubmit,
    handleLogout,
  };
};
