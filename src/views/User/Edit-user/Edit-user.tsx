import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../../components/NavBar/NavBar";
import {
  getCurrentUser,
  getUserById,
  updateUserById,
} from "../../../utils/authApi";
import "./Edit-user.scss";

/**
 * Displays a success popup message at the top of the screen.
 *
 * @param {string} message - The success message to display.
 * @returns {void}
 */
function showSuccess(message: string) {
  let popup = document.getElementById("popup-message");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popup-message";
    document.body.appendChild(popup);
  }
  popup.className = "popup-message popup-success popup-show";
  popup.textContent = message;
  // @ts-ignore
  clearTimeout((popup as any)._timeout);
  // @ts-ignore
  (popup as any)._timeout = setTimeout(() => {
    popup?.classList.remove("popup-show");
  }, 3000);
}

/**
 * React component for editing the user's profile information.
 * Fetches the current user's data on mount and allows updating name, age, and email.
 *
 * @component
 * @returns {JSX.Element} The EditUser page component.
 */
const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState("");
  const [edad, setEdad] = useState("");
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Loads the current user information from the backend on component mount.
   *
   * @async
   * @returns {Promise<void>}
   */
  useEffect(() => {
    const fetchUser = async () => {
      const localUser = getCurrentUser();
      if (localUser && localUser.id) {
        try {
          const freshUser = await getUserById(localUser.id);
          setNombres(freshUser.name || freshUser.nombres || "");
          setEdad(freshUser.age || freshUser.edad || "");
          setCorreo(freshUser.email || "");
        } catch (err: any) {
          setError("Failed to load user data.");
        }
      }
    };
    fetchUser();
  }, []);

  /**
   * Handles the form submission to update the user's profile.
   * Validates the input fields and sends an update request to the backend.
   *
   * @async
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const localUser = getCurrentUser();
      if (!localUser || !localUser.id) throw new Error("User not found");
      await updateUserById(localUser.id, {
        name: nombres,
        age: Number(edad),
        email: correo,
      });
      showSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/user"), 2000);
    } catch (err: any) {
      setError(err?.message || "Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="app-container-edit">
        <div className="main-content-edit">
          <div className="edit-box">
            <Link
              to="/user"
              className="back-arrow-edit"
              aria-label="Back to profile"
            >
              ←
            </Link>
            <img
              src="/static/img/film-icon.jpg"
              alt="PopFix logo"
              className="icon"
            />
            <h2>Edit Profile</h2>
            <p>Update your personal information</p>

            <form className="edit-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="nombres">Name</label>
              <input
                id="nombres"
                type="text"
                className="input"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                required
              />

              <label htmlFor="edad">Age</label>
              <input
                id="edad"
                type="number"
                className="input"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                min="1"
                max="120"
                required
              />

              <label htmlFor="correo">Email</label>
              <input
                id="correo"
                type="email"
                className="input"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="button" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>

            <div className="additional-links">
              <label className="login-redirect">
                <Link to="/change-password" className="login-link">
                  Change password
                </Link>
              </label>
              <label className="login-redirect">
                <Link to="/user" className="login-link">
                  Cancel and return
                </Link>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUser;
