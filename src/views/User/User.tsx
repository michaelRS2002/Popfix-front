import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { getCurrentUser } from '../../utils/authApi';
import './User.scss';

const User: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
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
                <div className="info-value">{user?.nombres || 'No disponible'}</div>
              </div>
              <div className="info-group">
                <label>Edad</label>
                <div className="info-value">{user?.edad || 'No disponible'}</div>
              </div>
              <div className="info-group">
                <label>Correo electrónico</label>
                <div className="info-value">{user?.email || 'No disponible'}</div>
              </div>
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
              <Link to="/" className="login-link">Volver al Inicio</Link>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;