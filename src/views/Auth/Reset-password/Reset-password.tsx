import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../../utils/authApi';
import NavBar from '../../../components/NavBar/NavBar';
import './Reset-password.scss';

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
const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Extract token from query params
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!password || !confirmPassword) {
      setError('Por favor ingresa y confirma tu nueva contraseña.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!token) {
      setError('Token inválido o expirado.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token, newPassword: password });
      showSuccess('¡Contraseña restablecida correctamente!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err?.data?.message || err?.message || 'Error al restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="app-container-reset">
        <div className="main-content-reset">
          <div className="reset-box">
            <Link to="/login" className="back-arrow-reset" aria-label="Volver al login">←</Link>
            <img src="/static/img/film-icon.jpg" alt="PopFix logo" className="icon" />
            <h2>Restablecer contraseña</h2>
            <p>Ingresa tu nueva contraseña para tu cuenta</p>
            <form className="reset-password-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="password">Nueva contraseña</label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                className="input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              {error && <div className="error-message">{error}</div>}
              {/* success popup handled globally */}
              <button type="submit" className="button" disabled={loading}>
                {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
              </button>
            </form>
            <label className="login-redirect">
              ¿Recordaste tu contraseña?{' '}
              <Link to="/login" className="login-link">Volver al Inicio de Sesión</Link>
            </label>
            <label className="login-redirect">
              ¿Aún no tienes cuenta? {' '}
              <Link to="/register" className="login-link">Registrarse</Link>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
