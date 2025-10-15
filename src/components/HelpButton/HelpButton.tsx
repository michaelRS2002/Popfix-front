import React from 'react';
import { FaQuestion } from 'react-icons/fa';
import './HelpButton.scss';

const HelpButton: React.FC = () => {
  const handleClick = () => {
    // Navegar a la página del mapa del sitio
    window.location.href = '/mapa-del-sitio';
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
