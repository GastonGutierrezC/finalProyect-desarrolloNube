import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { loginUser } from '@/controllers/loginController';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';


const LoginForm = () => {
  useAuthRedirect(); // 👈 verifica si ya está logueado

  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await loginUser(formData.email, formData.password);

    if (response.success && response.data) {
      const user = response.data;
      router.push({
        pathname: '/home',
        query: { nombre: user.nombre, apellido: user.apellido }
      });
    } else {
      setError(response.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
        <h2>Iniciar Sesión</h2>
        <input type="email" name="email" placeholder="Correo Gmail" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
        <button type="submit">Entrar</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
