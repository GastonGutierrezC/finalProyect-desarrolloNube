import { useAdminPanel } from '@/hooks/useAdminPanel';
import React from 'react';
import Header from '../Home/Header';


const AdminPanelView = () => {
  const {
    isAdmin,
    formData,
    mensaje,
    subiendo,
    handleChange,
    handleImageChange,
    handleSubmit,
    handleLogout,
  } = useAdminPanel();

  if (!isAdmin) return null;

  return (
    <div style={{ padding: 40 }}>
      <h1>🔐 Panel de Administración</h1>

      <h2>Agregar nuevo género musical</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: 400 }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del género"
          value={formData.nombre}
          onChange={handleChange}
          required
          style={{ marginBottom: 10 }}
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          required
          style={{ marginBottom: 10 }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: 10 }}
        />
        <button type="submit" disabled={subiendo}>
          {subiendo ? 'Subiendo imagen...' : 'Agregar género'}
        </button>
      </form>

      {mensaje && <p style={{ marginTop: 10 }}>{mensaje}</p>}

      <button onClick={handleLogout} style={{ marginTop: 30 }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default AdminPanelView;
