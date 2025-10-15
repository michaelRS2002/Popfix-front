import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaQuestion } from 'react-icons/fa';
import './HelpButton.scss';

const HelpButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // No mostrar el botón en la página del mapa del sitio
  if (location.pathname === '/mapa-del-sitio') {
    return null;
  }

  const handleClick = () => {
    navigate('/mapa-del-sitio');
  };

  return (
    <button 
      className="help-button" 
      onClick={handleClick}
      aria-label="Ayuda - Mapa del sitio"
      title="Mapa del sitio"
    >
      <FaQuestion />
    </button>
  );
};

export default HelpButton;
