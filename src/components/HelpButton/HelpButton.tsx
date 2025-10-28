/**
 * @fileoverview Floating help button component.
 * Displays a question mark icon that redirects the user to the site map page.
 * The button is hidden when the user is already on the site map.
 *
 * @module components/HelpButton
 */

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaQuestion } from "react-icons/fa";
import "./HelpButton.scss";

/**
 * A floating button that provides quick access to the site map.
 *
 * @component
 * @example
 * // Example usage:
 * <HelpButton />
 */
const HelpButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Hides the help button when the user is already on the site map page.
   *
   * @returns {null | JSX.Element} Returns `null` if the path is '/mapa-del-sitio', otherwise renders the button.
   */
  if (location.pathname === "/mapa-del-sitio") {
    return null;
  }

  /**
   * Handles click events on the help button.
   * Navigates the user to the '/mapa-del-sitio' route.
   *
   * @function
   * @returns {void}
   */
  const handleClick = (): void => {
    navigate("/mapa-del-sitio");
  };

  return (
    <button
      className="help-button"
      onClick={handleClick}
      aria-label="Help - Site map"
      title="Site map"
    >
      <FaQuestion aria-hidden="true" />
    </button>
  );
};

export default HelpButton;
