import React, { useState, useRef, useEffect } from "react";
import "./NavBar.scss";
import { FaUserCircle, FaUser, FaHeart, FaEdit, FaSignOutAlt, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../../utils/authApi';

interface NavBarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
}

const NavBar: React.FC<NavBarProps> = ({
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar si mostrar NavBar según la ruta
  const hideNavBar = ['/login', '/register', '/forgot-password', '/reset-password', '/'].includes(location.pathname);
  const isHome = location.pathname === '/home';
  const isFavorites = location.pathname === '/favoritos';
  const showSearch = isHome || isFavorites;
  const showFavoritesLink = !isFavorites;

  if (hideNavBar) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(e);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await logoutUser();
      if (res && res.message) {
        alert(res.message);
      } else {
        alert("Sesión cerrada correctamente");
      }
    } catch (err: any) {
      console.error("Logout error:", err);
      alert("Sesión cerrada");
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Close the menu when user click outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => handleNavigate('/home')}>
          PopFix
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-desktop">
          {/* Links */}
          <ul className="navbar-links">
            <li>
              <button 
                className="nav-link"
                onClick={() => handleNavigate('/home')}
              >
                Inicio
              </button>
            </li>
            {showFavoritesLink && (
              <li>
                <button 
                  className="nav-link"
                  onClick={() => handleNavigate('/favoritos')}
                >
                  Favoritos
                </button>
              </li>
            )}
          </ul>

          {/* Search Bar - Only on Home */}
          {showSearch && (
            <form onSubmit={handleSubmit} className="navbar-search">
              <button type="submit" className="navbar-search-icon" aria-label="Buscar">
                <FaSearch />
              </button>
              <input
                type="text"
                placeholder="Buscar películas..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="navbar-search-input"
              />
            </form>
          )}

          {/* Profile Menu */}
          <div className="navbar-actions" ref={menuRef}>
            <button 
              className="navbar-user-icon" 
              aria-label="Perfil de usuario"
              onClick={toggleMenu}
            >
              <FaUserCircle size={28} />
            </button>
            
            {isMenuOpen && (
              <div className="user-menu">
                <button 
                  className="user-menu-item"
                  onClick={() => handleNavigate('/perfil')}
                >
                  <FaUser />
                  <span>Mi perfil</span>
                </button>
                <button 
                  className="user-menu-item"
                  onClick={() => handleNavigate('/edit-user')}
                >
                  <FaEdit />
                  <span>Editar perfil</span>
                </button>
                <button 
                  className="user-menu-item logout-item"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="navbar-mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Menú móvil"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile">
          <ul className="mobile-links">
            <li>
              <button 
                className="mobile-link"
                onClick={() => handleNavigate('/home')}
              >
                Inicio
              </button>
            </li>
            {showFavoritesLink && (
              <li>
                <button 
                  className="mobile-link"
                  onClick={() => handleNavigate('/favoritos')}
                >
                  Favoritos
                </button>
              </li>
            )}
          </ul>

          {/* Mobile Search - Only on Home */}
          {showSearch && (
            <form onSubmit={handleSubmit} className="mobile-search">
              <button type="submit" className="mobile-search-icon" aria-label="Buscar">
                <FaSearch />
              </button>
              <input
                type="text"
                placeholder="Buscar películas..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="mobile-search-input"
              />
            </form>
          )}

          {/* Mobile Profile Menu */}
          <div className="mobile-profile">
            <button 
              className="mobile-profile-item"
              onClick={() => handleNavigate('/perfil')}
            >
              <FaUser />
              <span>Mi perfil</span>
            </button>
            <button 
              className="mobile-profile-item"
              onClick={() => handleNavigate('/edit-user')}
            >
              <FaEdit />
              <span>Editar perfil</span>
            </button>
            <button 
              className="mobile-profile-item logout-item"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
