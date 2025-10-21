import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import { getCurrentUser, getUserById } from "../../utils/authApi";
import "./User.scss";

/**
 * `User` is a React functional component that displays the profile information
 * of the currently authenticated user.
 * It attempts to fetch updated user data from the backend; if the request fails,
 * it falls back to locally stored user data.
 *
 * @component
 * @example
 * return (
 *   <User />
 * )
 *
 * @returns {JSX.Element} The rendered User Profile page.
 */
const User: React.FC = () => {
  /** @type {[any, React.Dispatch<React.SetStateAction<any>>]} */
  const [user, setUser] = useState<any>(null);

  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [loading, setLoading] = useState(true);

  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [error, setError] = useState<string | null>(null);

  /**
   * Loads the current user's profile information.
   *
   * It first checks for a valid local user; if available, it attempts to fetch
   * fresh data from the backend using `getUserById`.
   * If the fetch fails, it logs the error and falls back to the cached user data.
   *
   * @async
   * @function
   * @returns {Promise<void>} Resolves when the user data is loaded or a fallback is applied.
   */
  useEffect(() => {
    const loadUserData = async (): Promise<void> => {
      try {
        const localUser = getCurrentUser();
        if (!localUser || !localUser.id) {
          setError("User information not found");
          setLoading(false);
          return;
        }

        // Fetch updated user data from backend
        const freshUserData = await getUserById(localUser.id);
        setUser(freshUserData);
      } catch (err: any) {
        console.error("Error loading user data:", err);
        setError(err.message || "Error loading user information");

        // Fallback to locally stored data
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

  // --- Conditional rendering states ---

  /**
   * Displays a loading message while the user data is being fetched.
   */
  if (loading) {
    return (
      <>
        <NavBar />
        <div className="app-container-user">
          <div className="main-content-user">
            <div className="user-box">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  /**
   * Displays an error message if the user data could not be loaded.
   */
  if (error && !user) {
    return (
      <>
        <NavBar />
        <div className="app-container-user">
          <div className="main-content-user">
            <div className="user-box">
              <p className="error-message">{error}</p>
              <Link to="/home" className="login-link">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  /**
   * Displays the user's profile information, including name, age, and email.
   * Also includes links to edit or delete the account.
   */
  return (
    <>
      <NavBar />
      <div className="app-container-user">
        <div className="main-content-user">
          <div className="user-box">
            <Link
              to="/home"
              className="back-arrow-user"
              aria-label="Return to home"
            >
              ←
            </Link>
            <img
              src="/static/img/film-icon.jpg"
              alt="PopFix logo"
              className="icon"
            />
            <h2>User Profile</h2>
            <p>Account Information</p>

            <div className="user-info">
              <div className="info-group">
                <label>Full Name</label>
                <div className="info-value">
                  {user?.name || user?.nombres || "Not available"}
                </div>
              </div>
              <div className="info-group">
                <label>Age</label>
                <div className="info-value">
                  {user?.age || user?.edad || "Not available"}
                </div>
              </div>
              <div className="info-group">
                <label>Email</label>
                <div className="info-value">
                  {user?.email || "Not available"}
                </div>
              </div>
              {error && (
                <p
                  className="error-message"
                  style={{ marginTop: 8, fontSize: "0.85rem" }}
                >
                  ⚠️ Showing cached data
                </p>
              )}
            </div>

            <div className="user-actions">
              <Link to="/edit-user" className="btn-edit">
                Edit Profile
              </Link>
              <Link to="/delete-user" className="btn-delete">
                Delete Account
              </Link>
            </div>

            <label className="login-redirect">
              <Link to="/home" className="login-link">
                Return to Home
              </Link>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
