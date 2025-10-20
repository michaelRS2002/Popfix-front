/**
 * @file Register.tsx
 * @description Registration page component for PopFix. Handles new user creation,
 * form validation, backend integration, and success/error feedback via popup messages.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.scss";
import NavBar from "../../../components/NavBar/NavBar";
import { Link } from "react-router-dom";
import { validateRegisterForm } from "../../../utils/validators";
import { registerUser } from "../../../utils/authApi";

/**
 * Displays a temporary popup message for successful actions.
 * Automatically hides the popup after 3 seconds.
 *
 * @param {string} message - The success message to display.
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

  // Remove popup after 3 seconds
  // @ts-ignore
  clearTimeout((popup as any)._timeout);
  // @ts-ignore
  (popup as any)._timeout = setTimeout(() => {
    popup?.classList.remove("popup-show");
  }, 3000);
}

/**
 * Register component for user account creation.
 * Handles input changes, validation, submission, and feedback.
 *
 * @component
 * @returns {JSX.Element} The rendered registration form.
 */
const Register: React.FC = () => {
  /** @state {Object} formData - Stores all form field values for registration. */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  /** @state {Object} errors - Holds field-specific validation error messages. */
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  /** @state {string|null} formError - Stores backend or global form errors. */
  const [formError, setFormError] = useState<string | null>(null);

  /** @state {string|null} formSuccess - Stores success messages upon registration. */
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  /** @state {boolean} loading - Indicates whether form submission is in progress. */
  const [loading, setLoading] = useState(false);

  /** React Router navigation hook. */
  const navigate = useNavigate();

  /**
   * Handles updates to form input fields.
   * Removes field-specific errors when the user modifies input.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

    // Remove the error of the modified field
    const { [e.target.id]: removed, ...rest } = errors;
    setErrors(rest);
    setFormError(null);
  };

  /**
   * Handles form submission for user registration.
   * Validates input, sends data to backend, and provides user feedback.
   *
   * @async
   * @param {React.FormEvent} e - Form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const { isValid, errors: validationErrors } =
      validateRegisterForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        age: Number(formData.age),
        password: formData.password,
      });

      showSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      const backendMsg = error?.data?.message || error?.message;
      setFormError(backendMsg || "Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="app-container-register">
        <div className="main-content-register">
          <div className="left-section-register">
            <div className="register-box">
              <Link to="/" className="back-arrow" aria-label="Go back to home">
                ←
              </Link>
              <h2>Sign up and create your account</h2>

              <form className="form" onSubmit={handleSubmit} noValidate>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your full name"
                  className="input"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}

                <div className="form-row">
                  <div style={{ flex: 3 }}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@gmail.com"
                      className="input"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.email && (
                      <span className="error-message">{errors.email}</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="age">Age</label>
                    <input
                      type="number"
                      id="age"
                      placeholder="Your age"
                      className="input"
                      value={formData.age}
                      onChange={handleChange}
                      disabled={loading}
                      min={0}
                    />
                    {errors.age && (
                      <span className="error-message">{errors.age}</span>
                    )}
                  </div>
                </div>

                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="********"
                  className="input"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}

                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="********"
                  className="input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}

                <button type="submit" className="button" disabled={loading}>
                  {loading ? "Loading..." : "Sign Up"}
                </button>

                {formError && (
                  <div className="error-message" style={{ marginTop: 8 }}>
                    {formError}
                  </div>
                )}
                {formSuccess && (
                  <div
                    className="success-message"
                    style={{ marginTop: 8, color: "green" }}
                  >
                    {formSuccess}
                  </div>
                )}
              </form>

              <label className="login-redirect">
                Already have an account?{" "}
                <a href="/login" className="login-link">
                  Sign in here
                </a>
              </label>
            </div>
          </div>

          <div className="right-section-register">
            <h1 className="title-logo">PopFix</h1>
            <img
              src="/static/img/film-icon.jpg"
              alt="PopFix logo"
              className="icon"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
