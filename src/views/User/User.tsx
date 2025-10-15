import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { getCurrentUser, getUserById } from '../../utils/authApi';
import './User.scss';

const User: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const localUser = getCurrentUser();
        if (!localUser || !localUser.id) {
          setError('No se encontró información de usuario');
          setLoading(false);
          return;
        }

        // Hacer GET al backend para obtener datos actualizados
        const freshUserData = await getUserById(localUser.id);
        setUser(freshUserData);
      } catch (err: any) {
        console.error('Error al cargar usuario:', err);
        setError(err.message || 'Error al cargar los datos del usuario');
        // Fallback a datos locales si falla el GET
        const localUser = getCurrentUser();
        if (localUser) {
          setUser(localUser);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="app-container-user">
          <div className="main-content-user">
            <div className="user-box">
              <p>Cargando...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error && !user) {
    return (
      <>
        <NavBar />
        <div className="app-container-user">
          <div className="main-content-user">
            <div className="user-box">
              <p className="error-message">{error}</p>
              <Link to="/home" className="login-link">Volver al Inicio</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="app-container-user">
        <div className="main-content-user">
          <div className="user-box">
            <Link to="/home" className="back-arrow-user" aria-label="Volver al inicio">←</Link>
            <img src="/static/img/film-icon.jpg" alt="PopFix logo" className="icon" />
            <h2>Perfil de Usuario</h2>
            <p>Información de tu cuenta</p>
            
            <div className="user-info">
              <div className="info-group">
                <label>Nombre Completo</label>
                <div className="info-value">{user?.name || user?.nombres || 'No disponible'}</div>
              </div>
              <div className="info-group">
                <label>Edad</label>
                <div className="info-value">{user?.age || user?.edad || 'No disponible'}</div>
              </div>
              <div className="info-group">
                <label>Correo electrónico</label>
                <div className="info-value">{user?.email || 'No disponible'}</div>
              </div>
              {error && <p className="error-message" style={{ marginTop: 8, fontSize: '0.85rem' }}>⚠️ Mostrando datos en caché</p>}
            </div>

            <div className="user-actions">
              <Link to="/edit-user" className="btn-edit">
                Editar Perfil
              </Link>
              <Link to="/delete-user" className="btn-delete">
                Eliminar Cuenta
              </Link>
            </div>

            <label className="login-redirect">
              <Link to="/home" className="login-link">Volver al Inicio</Link>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;