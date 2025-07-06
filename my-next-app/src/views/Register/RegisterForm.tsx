import React, { useState } from 'react';
import { registerUser } from '@/controllers/authController';
import { useRouter } from 'next/router';

const RegisterForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    rol: 'normal',
    imageURL: "https://i.pinimg.com/236x/75/2d/f8/752df8d56893f96033558fc84d7929e1.jpg",
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await registerUser(formData);

    if (response.success) {
      router.push('/login');
    } else {
      setError(response.message || 'Error al registrar usuario');
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
        <h2>Registrarse</h2>

        <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required style={{ marginBottom: 10 }} />
        <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} required style={{ marginBottom: 10 }} />
        <input type="email" name="email" placeholder="Correo Gmail" onChange={handleChange} required style={{ marginBottom: 10 }} />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required style={{ marginBottom: 10 }} />
        <input type="date" name="fechaNacimiento" onChange={handleChange} required style={{ marginBottom: 10 }} />

        <button type="submit">Crear cuenta</button>

        {error && (
          <p style={{ color: 'red', marginTop: 10, fontSize: 14 }}>
            {error}
          </p>
        )}

        <p style={{ marginTop: 10, fontSize: 14, textAlign: 'center' }}>
          ¿Ya tenés una cuenta? <a href="/login" style={{ color: 'blue' }}>Ingresá aquí</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
