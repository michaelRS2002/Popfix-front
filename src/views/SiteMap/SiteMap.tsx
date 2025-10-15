import React from 'react';
import './SiteMap.scss';
import NavBar from '../../components/NavBar/NavBar';

const SiteMap: React.FC = () => {
  return (
    <div className="SiteMap">
      <NavBar />
      
      <div className="sitemap-container">
        <h1>Mapa del Sitio</h1>
        <p className="sitemap-description">
          Encuentra todo lo que necesitas en PopFix. Aquí está el mapa completo de navegación.
        </p>

        <div className="sitemap-sections">
          <div className="sitemap-section">
            <h2>Navegación Principal</h2>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/peliculas">Películas</a></li>
              <li><a href="/favoritos">Favoritos</a></li>
              <li><a href="/perfil">Perfil</a></li>
            </ul>
          </div>

          <div className="sitemap-section">
            <h2>Usuario</h2>
            <ul>
              <li><a href="/login">Iniciar Sesión</a></li>
              <li><a href="/register">Registrarse</a></li>
              <li><a href="/user">Mi Perfil</a></li>
              <li><a href="/edit-user">Editar Perfil</a></li>
              <li><a href="">Cambiar Contraseña</a></li>
              <li><a href="">Eliminar Cuenta</a></li>
            </ul>
          </div>

          <div className="sitemap-section">
            <h2>Recuperación</h2>
            <ul>
              <li><a href="/forgot-password">Olvidé mi Contraseña</a></li>
              <li><a href="">Restablecer Contraseña</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMap;
