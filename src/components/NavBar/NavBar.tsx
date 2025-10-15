import React, { useState, useRef, useEffect } from "react";
import "./NavBar.scss";
import { FaUserCircle, FaUser, FaHeart, FaEdit, FaSignOutAlt, FaSearch } from "react-icons/fa";

interface NavBarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
}

const NavBar: React.FC<NavBarProps> = ({ searchQuery = '', onSearchChange, onSearchSubmit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(e);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cerrar el menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar_logo">PopFix</div>
      
      <ul className="navbar_links">
        <li><a href="/">Inicio</a></li>
        <li><a href="/peliculas">Películas</a></li>
        <li><a href="/favoritos">Favoritos</a></li>
        <li><a href="/perfil">Perfil</a></li>
      </ul>
      
      <div className="navbar_right">
        {/* Barra de búsqueda */}
        <form onSubmit={handleSubmit} className="navbar_search">
        <button type="submit" className="navbar_search-icon" aria-label="Buscar">
          <FaSearch />
        </button>
        <input
          type="text"
          placeholder="Buscar Películas"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="navbar_search-input"
        />
      </form>

        <div className="navbar_actions" ref={menuRef}>
          <button 
            className="navbar_user-icon" 
            aria-label="Perfil de usuario"
            onClick={toggleMenu}
          >
            <FaUserCircle size={24} />
          </button>
          
          {isMenuOpen && (
            <div className="user-menu">
              <a href="/user" className="user-menu-item">
                <FaUser />
                <span>Mi perfil</span>
              </a>
              <a href="/favoritos" className="user-menu-item">
                <FaHeart />
                <span>Lista de favoritos</span>
              </a>
              <a href="/edit-user" className="user-menu-item">
                <FaEdit />
                <span>Editar perfil</span>
              </a>
              <a href="/logout" className="user-menu-item">
                <FaSignOutAlt />
                <span>Cerrar sesión</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
