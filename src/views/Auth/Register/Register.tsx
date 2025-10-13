import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Register.scss";
import NavBar from '../../../components/NavBar';
import { Link } from 'react-router-dom';
import { validateRegisterForm } from '../../../utils/validators';
import { registerUser } from '../../../utils/authApi';
// Popup logic solo para success
function showSuccess(message: string) {
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
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    const { [e.target.id]: removed, ...rest } = errors;
    setErrors(rest);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    const { isValid, errors: validationErrors } = validateRegisterForm(formData);
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
        password: formData.password
      });
      showSuccess('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      setFormError(error.message || 'Error al registrar usuario');
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
              <Link to="/" className="back-arrow" aria-label="Volver al inicio">←</Link>
              <h2>Regístrate y crea tu cuenta</h2>
              <form className="form" onSubmit={handleSubmit} noValidate>
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Tu nombre completo"
                  className="input"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}

                <div className="form-row">
                  <div style={{ flex: 3 }}>
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
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="age">Edad</label>
                    <input
                      type="number"
                      id="age"
                      placeholder="Tu edad"
                      className="input"
                      value={formData.age}
                      onChange={handleChange}
                      disabled={loading}
                      min={0}
                    />
                    {errors.age && <span className="error-message">{errors.age}</span>}
                  </div>
                </div>

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

                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="********"
                  className="input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}

                <button type="submit" className="button" disabled={loading}>
                  {loading ? 'Cargando...' : 'Registrarse'}
                </button>
                {formError && <div className="error-message" style={{ marginTop: 8 }}>{formError}</div>}
                {formSuccess && <div className="success-message" style={{ marginTop: 8, color: 'green' }}>{formSuccess}</div>}
              </form>
              <label className="login-redirect">
                ¿Ya tienes cuenta?{' '}
                <a href="/auth/login" className="login-link">Inicia sesión aquí</a>
              </label>
            </div>
          </div>
          <div className="right-section-register">
            <h1 className="title-logo">PopFix</h1>
            <img src="/static/img/film-icon.jpg" alt="PopFix logo" className="icon" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
