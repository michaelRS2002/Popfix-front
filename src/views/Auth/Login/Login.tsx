import React, { useState } from "react";
import "./Login.scss";
import NavBar from '../../../components/NavBar/NavBar';
import { Link } from 'react-router-dom';
import { validateLoginForm } from '../../../utils/validators';
import { loginUser } from '../../../utils/authApi';


const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: undefined });
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const { isValid, errors: validationErrors } = validateLoginForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await loginUser(formData);
      showSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
      setTimeout(() => {
        window.location.href = '/home';
      }, 1500);
    } catch (error: any) {
      setFormError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    let popup = document.getElementById('popup-message');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'popup-message';
      document.body.appendChild(popup);
    }
    popup.className = 'popup-message popup-success popup-show';
    popup.textContent = message;
    // Remove after 3s
    // @ts-ignore
    clearTimeout((popup as any)._timeout);
    // @ts-ignore
    (popup as any)._timeout = setTimeout(() => {
      popup?.classList.remove('popup-show');
    }, 3000);
  };

  return (
    <>
      <NavBar />
      <div className="app-container">
        <div className="left-section">
          <Link to="/" className="back-arrow-login" aria-label="Volver al inicio">←</Link>
          <h1 className="title-logo">PopFix</h1>
          <img src="/static/img/film-icon.jpg" alt="PopFix logo" className="icon" />
        </div>

        <div className="right-section">
          <div className="login-box">
            <h2>Inicia Sesión</h2>
            <p>para acceder a tu biblioteca de películas</p>

            <form className="form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="tu@gmail.com"
                className="input"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}

              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="********"
                className="input"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}

              <button type="submit" className="button" disabled={loading}>
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
              </button>
              {formError && <div className="error-message" style={{ marginTop: 8 }}>{formError}</div>}
            </form>

            <a href="/forgot-password" className="forgot">
              ¿Olvidaste tu contraseña?
            </a>

            <p className="register-text">
              ¿No tienes cuenta?{" "}
              <a href="/register" className="register-link">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

