import React from "react";
import "./NavBar.scss";

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar_logo">PopFix</div>
      <ul className="navbar_links">
        <li><a href="/">Inicio</a></li>
        <li><a href="/peliculas">Películas</a></li>
        <li><a href="/favoritos">Favoritos</a></li>
        <li><a href="/perfil">Perfil</a></li>
      </ul>
      <div className="navbar_auth">
        <a href="/login" className="navbar_login">Iniciar Sesión</a>
      </div>
    </nav>
  );
};

export default NavBar;
